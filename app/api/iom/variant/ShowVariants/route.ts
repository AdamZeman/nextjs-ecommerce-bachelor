import {NextResponse} from 'next/server';
import { getDbConnection } from '@/lib/db';
import {
    getVariantsFilledProducts,

} from '@/db/goqueries/query_sql';

export async function GET() {
    const client = await getDbConnection();
    try {
        const variants = await getVariantsFilledProducts(client);
        return NextResponse.json({
            variants
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    } finally {
        client.release();
    }
}


