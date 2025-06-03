import {NextRequest, NextResponse} from 'next/server';
import { getDbConnection } from '@/lib/db';
import {
    getCategoriesFilteredProductID,

} from '@/db/goqueries/query_sql';

export async function POST(req: NextRequest) {
    const client = await getDbConnection();
    try {
        const body = await req.json();
        const productId = parseInt(body.productId as string);

        const categories = await getCategoriesFilteredProductID(client,{
            productId: productId
        });
        return NextResponse.json({
            categories
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    } finally {
        client.release();
    }
}


