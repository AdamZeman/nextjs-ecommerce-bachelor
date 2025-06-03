import { NextRequest, NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/db';
import { updateVariant } from '@/db/goqueries/query_sql';

export async function POST(req: NextRequest) {
    const client = await getDbConnection();

    try {
        const body = await req.json();
        const variantId = parseInt(body.id as string);
        const sku = body.sku as string;
        const stockQuantity = parseInt(body.stockQuantity as string);
        const price = parseInt(body.price as string);
        const option_1Value = body.option_1Value as string;
        const option_2Value = body.option_2Value as string;

        if (isNaN(variantId) || isNaN(stockQuantity) || isNaN(price)) {
            return NextResponse.json(
                { error: 'Invalid numeric values provided' },
                { status: 400 }
            );
        }

        await updateVariant(client, {
            id: variantId,
            sku,
            stockQuantity,
            price,
            option_1Value,
            option_2Value
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