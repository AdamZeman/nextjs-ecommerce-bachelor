import {NextRequest, NextResponse} from 'next/server';
import { getDbConnection } from '@/lib/db';
import {
    removeFromBasket,
} from '@/db/goqueries/query_sql';
import { z } from 'zod';

const schema = z.object({
    basketItemId: z.number(),
});

export async function POST(req: NextRequest) {
    const client = await getDbConnection();
    try {
        const body = await req.json();
        const parsed = schema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }
        const { basketItemId } = parsed.data;
        await removeFromBasket(client, {
            id:basketItemId
        });
        return NextResponse.json({
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    } finally {
        client.release();
    }
}


