import { NextRequest, NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/db';
import { updateProduct } from '@/db/goqueries/query_sql';

import { z } from 'zod';

const schema = z.object({
    id: z.number().min(1),
    name: z.string().min(1),
    description: z.string().min(1),
    price: z.coerce.number().positive(),
    option_1Name: z.string().min(1),
    option_2Name: z.string().min(1),
    special: z.preprocess(
        (val) => val === '' ? null : Number(val),
        z.number().nonnegative().nullable()
    )
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
        await updateProduct(client, {
            id: form.id,
            name: form.name,
            description: form.description,
            price: form.price,
            option_1Name: form.option_1Name,
            option_2Name: form.option_2Name,
            special: form.special
        });

        return NextResponse.json({});

    } catch (err) {
        console.error('Error updating product:', err);
        return NextResponse.json(
            { error: 'Failed to update variant' },
            { status: 500 }
        );
    }
}