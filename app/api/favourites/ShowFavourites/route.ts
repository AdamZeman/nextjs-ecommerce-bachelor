import {  NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/db';
import {
    getFavouritesById
} from '@/db/goqueries/query_sql';
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/options";

export async function GET() {
    const client = await getDbConnection();
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const userEmail = session.user.email;
        if(!userEmail){
            return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
        }
        const favourites = await getFavouritesById(client, {
            email:userEmail
        });
        return NextResponse.json({
            favourites,
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    } finally {
        client.release();
    }
}
