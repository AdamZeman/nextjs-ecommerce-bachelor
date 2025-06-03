import { NextRequest, NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/db';
import { updateOrderStatus } from '@/db/goqueries/query_sql';

export async function POST(req: NextRequest) {
    const client = await getDbConnection();
    try {
        const body = await req.json();
        const orderID = body.id;

        await updateOrderStatus(client, {
            id: orderID,
            status: "done"
        });

        return NextResponse.json({});

    } catch (err) {
        console.error('Error updating variant:', err);
        return NextResponse.json(
            { error: 'Failed to update variant' },
            { status: 500 }
        );
    }
}