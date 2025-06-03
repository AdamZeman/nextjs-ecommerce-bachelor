import {NextRequest, NextResponse} from 'next/server';
import { getDbConnection } from '@/lib/db';
import {
    getBasketItemByBasketItemId,
    insertBasketItem,

} from '@/db/goqueries/query_sql';
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/options";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await getDbConnection();
    try {
        const body = await req.json();
        const variantId = body.variant.id;
        const amount = body.amount;
        const userId = session.user.id;

        if (
            !body.variant ||
            typeof body.variant.id !== 'number' ||
            body.amount === undefined ||
            typeof body.amount !== 'number'
        ) {
            return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
        }

        const insertedItem = await insertBasketItem(client, {
            userId:userId,
            productVariantId: variantId,
            quantity:amount
        });

        if(!insertedItem){
            return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
        }

        const basketItem = await getBasketItemByBasketItemId(client, {
            id: insertedItem.id
        })

        return NextResponse.json({
            basketItem
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    } finally {
        client.release();
    }
}


