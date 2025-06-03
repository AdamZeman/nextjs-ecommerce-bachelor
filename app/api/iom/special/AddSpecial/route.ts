import { NextRequest, NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/db';
import { insertSpecial } from '@/db/goqueries/query_sql';

export async function POST(req: NextRequest) {
    const body = await req.json();

    try {
        const client = await getDbConnection();
        const name = body.name;

        await insertSpecial(client, {
            name
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