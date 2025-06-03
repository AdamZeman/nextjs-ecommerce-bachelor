import {NextRequest, NextResponse} from 'next/server';
import { getDbConnection } from '@/lib/db';
import {
    getFavouriteByProductId,
    insertItemToFavourites,
    removeItemFromFavourites
} from '@/db/goqueries/query_sql';
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/options";
import { z } from 'zod';

const schema = z.object({
    productId: z.coerce.number().int().positive(),
});

export async function POST(req: NextRequest ) {
    const client = await getDbConnection();
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const body = await req.json();
        const userId = session.user.id;
        const parsed = schema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }
        const form = parsed.data;

        const favourites = await getFavouriteByProductId(client, {
            productId:form.productId,
            userId:userId
        });

        if (favourites.length > 0){
            await removeItemFromFavourites(client, {
                productId:form.productId,
                userId:userId
            });
        }else{
            await insertItemToFavourites(client, {
                productId:form.productId,
                userId:userId
            });
        }
        return NextResponse.json({
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    } finally {
        client.release();
    }
}
