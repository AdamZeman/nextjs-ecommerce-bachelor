import { NextRequest, NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/db';
import { insertCategory } from '@/db/goqueries/query_sql';

export async function POST(req: NextRequest) {
    const client = await getDbConnection();
    try {
        const body = await req.json();
        const name = body.name;
        await insertCategory(client, {
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