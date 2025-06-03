import {NextRequest, NextResponse} from 'next/server';
import { getDbConnection } from '@/lib/db';
import {
    getVariantByOptions,

} from '@/db/goqueries/query_sql';

export async function POST(req: NextRequest) {
    const client = await getDbConnection();
    try {
        const body = await req.json();
        const productId = parseInt(body.productId, 10);
        const option_1Value = body.option_1Value;
        const option_2Value = body.option_2Value;

        const variant = await getVariantByOptions(client, {
            productId: productId,
            option_1Value: option_1Value,
            option_2Value: option_2Value,
        });
        return NextResponse.json({
            variant,
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    } finally {
        client.release();
    }
}


