import { NextRequest, NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/db';
import { updateSpecial } from '@/db/goqueries/query_sql';

export async function POST(req: NextRequest) {
    const client = await getDbConnection();

    try {
        const body = await req.json();
        const id = body.id;
        const name = body.name;

        await updateSpecial(client, {
            id: id,
            name: name
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