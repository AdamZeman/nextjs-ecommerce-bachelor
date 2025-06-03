import {NextResponse} from 'next/server';
import { getDbConnection } from '@/lib/db';
import {
    getOrdersFillUserConvByStatus,

} from '@/db/goqueries/query_sql';

export async function GET() {
    const client = await getDbConnection();
    try {
        const orders = await getOrdersFillUserConvByStatus(client,{
            status: "issue"
        });
        return NextResponse.json({
            orders
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    } finally {
        client.release();
    }
}


