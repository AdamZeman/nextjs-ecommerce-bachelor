import {NextRequest, NextResponse} from 'next/server';
import { getDbConnection } from '@/lib/db';
import {
    getOrderItemsByOrderID,

} from '@/db/goqueries/query_sql';

export async function POST(req: NextRequest) {
    const client = await getDbConnection();

    try {
        const formData = await req.json();
        const id = formData.id;
        const orderItems = await getOrderItemsByOrderID(client, {
            id:id
        });
        return NextResponse.json({
            orderItems
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    } finally {
        client.release();
    }
}


