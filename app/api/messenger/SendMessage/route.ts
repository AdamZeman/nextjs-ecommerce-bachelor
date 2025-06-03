import {NextRequest, NextResponse} from 'next/server';
import { getDbConnection } from '@/lib/db';
import {
    insertMessage
} from '@/db/goqueries/query_sql';
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/options";

export async function POST(req: NextRequest) {
    const client = await getDbConnection();
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const email = session.user.email;
        if(!email){
            return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });

        }
        const body = await req.json();


        const input = body.input;
        const convId = body.convId;

        await insertMessage(client, {
            conversationId: convId,
            email: email,
            content: input
        });

        return NextResponse.json({});

    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    } finally {
        client.release();
    }
}


