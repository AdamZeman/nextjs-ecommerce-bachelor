import {NextRequest, NextResponse} from 'next/server';
import { getDbConnection } from '@/lib/db';
import {
    getProductsByCategoriesAndName,
    getCategories,
    getSpecial, getProductCategoriesManyToMany

} from '@/db/goqueries/query_sql';
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/options";
import { z } from 'zod';

export const schema = z.object({
    nameFilter:   z.string().optional().default(""),
    categoryIds:  z.array(z.number().int().nonnegative()).optional().default([]),
    specialIds:   z.array(z.number().int().nonnegative()).optional().default([]),
    priceFrom:    z.coerce.number().int().nonnegative().optional().default(0),
    priceTo:      z.coerce.number().int().nonnegative().optional().default(999999),
    page:         z.coerce.number().int().positive().optional().default(1),
    limit:        z.coerce.number().int().positive().optional().default(30),
});


export async function POST(req: NextRequest) {
    const client = await getDbConnection();
    const session = await getServerSession(authOptions);

    try {
        const body = await req.json();
        const parsed = schema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }
        const form = parsed.data;

        if (form.priceTo == 0){
            form.priceTo = 999999
        }

        const userId = session?.user?.id ?? 0;
        const products = await getProductsByCategoriesAndName(client, {
            nameFilter: form.nameFilter,
            categoryIds: form.categoryIds,
            specialIds: form.specialIds,
            priceFrom: form.priceFrom * 100,
            priceTo: form.priceTo * 100,
            userId: userId,
            offsetvar: (form.page - 1) * form.limit,
            limitvar: form.limit
        });

        const categories = await getCategories(client);
        const special = await getSpecial(client);
        const productCategory = await getProductCategoriesManyToMany(client);

        return NextResponse.json({
            products,
            categories,
            special,
            productCategory
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    } finally {
        client.release();
    }
}
