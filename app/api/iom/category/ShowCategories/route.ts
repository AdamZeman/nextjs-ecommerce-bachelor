import {NextResponse} from 'next/server';
import { getDbConnection } from '@/lib/db';
import {
    getCategories,

} from '@/db/goqueries/query_sql';

export async function GET() {
    const client = await getDbConnection();
    try {
        const categories = await getCategories(client);
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


