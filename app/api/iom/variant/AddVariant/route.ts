import { NextRequest, NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/db';
import { insertVariant } from '@/db/goqueries/query_sql';

export async function POST(req: NextRequest) {
    const client = await getDbConnection();

    try {
        const body = await req.json();
        body.productId = "1"

        const productId = parseInt(body.productId as string);
        const sku = body.sku as string;
        const stockQuantity = parseInt(body.stockQuantity as string);
        const price = parseInt(body.price as string);
        const option_1Value = body.option_1Value as string;
        const option_2Value = body.option_2Value as string;

        if (isNaN(productId) || isNaN(stockQuantity) || isNaN(price)) {
            return NextResponse.json(
                { error: 'Invalid numeric values provided' },
                { status: 400 }
            );
        }
        await insertVariant(client, {
            productId,
            sku,
            stockQuantity,
            price,
            option_1Value,
            option_2Value
        });

        return NextResponse.json({});

    } catch (err) {
        console.error('Error adding variant:', err);
        return NextResponse.json(
            { error: 'Failed to add variant' },
            { status: 500 }
        );
    }
}