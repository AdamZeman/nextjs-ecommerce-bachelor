import {NextResponse} from 'next/server';
import { getDbConnection } from '@/lib/db';
import {
    getProducts,

} from '@/db/goqueries/query_sql';

export async function GET() {
    const client = await getDbConnection();
    try {
        const products = await getProducts(client);
        return NextResponse.json({
            products
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    } finally {
        client.release();
    }
}


