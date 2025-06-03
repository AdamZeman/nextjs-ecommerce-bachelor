import { NextRequest, NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/db';
import { insertProduct } from '@/db/goqueries/query_sql';

import { z } from 'zod';

const schema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    price: z.coerce.number().positive(),
    option_1Name: z.string().min(1),
    option_2Name: z.string().min(1),
    special: z.coerce.number().nonnegative()
});

export async function POST(req: NextRequest) {
    const client = await getDbConnection();
    try {
        const body = await req.json();
        const parsed = schema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }
        const form = parsed.data;

        await insertProduct(client, {
            name: form.name,
            description: form.description,
            price: form.price,
            option_1Name: form.option_1Name,
            option_2Name: form.option_2Name,
            special: form.special
        });
        return NextResponse.json({});

    } catch (err) {
        console.error('Error adding:', err);
        return NextResponse.json(
            { error: 'Error adding' },
            { status: 500 }
        );
    }
}