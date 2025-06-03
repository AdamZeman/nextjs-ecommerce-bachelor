import {NextRequest, NextResponse} from 'next/server';
import { getDbConnection } from '@/lib/db';
import {
    addProductCategoryByIDs, deleteProductCategoryByIDs,

} from '@/db/goqueries/query_sql';

export async function POST(req: NextRequest) {
    const client = await getDbConnection();

    try {
        const formData = await req.json();

        const productId = parseInt(formData.productId as string);
        const categoryId = parseInt(formData.categoryId as string);
        const isTrue = parseInt(formData.isTrue as string);

        if (isTrue) {
            await deleteProductCategoryByIDs(client,{
                productId: productId,
                categoryId: categoryId
            });
        }else{
            await addProductCategoryByIDs(client,{
                productId: productId,
                categoryId: categoryId
            });
        }
        return NextResponse.json({});

    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    } finally {
        client.release();
    }
}


