import {NextRequest, NextResponse} from 'next/server';
import { getDbConnection } from '@/lib/db';
import {
    getProductById,
    getReviewsFillUserByProductID,
    getCategoriesByProductID,
    getProductVariantsByProductId,
    getFavouriteByProductId, getProductsByCategoriesAndName
} from '@/db/goqueries/query_sql';
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/options";

export async function POST(req: NextRequest) {
    const client = await getDbConnection();
    const session = await getServerSession(authOptions);

    try {
        const body = await req.json()
        const id = body.id ?? 1
        const user = session?.user

        const product = await getProductById(client, {
            id:id
        });
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }
        const variants = await getProductVariantsByProductId(client, {
            id:product.id
        });

        let favourites;
        if (user){
            favourites = await getFavouriteByProductId(client, {
                userId:user.id,
                productId:product.id
            });
        }else{
            favourites = []
        }

        const reviews = await getReviewsFillUserByProductID(client, {
            productId:product.id
        });

        const relatedProducts = await getProductsByCategoriesAndName(client, {
            nameFilter: "",
            categoryIds: [],
            specialIds: [product?.special ?? 1],
            priceFrom: 0,
            priceTo: 99999999,
            userId: 1,
            offsetvar: 0,
            limitvar: 10
        });


        const categories = await getCategoriesByProductID(client, {
            productId:product.id
        });

        const isFavourite = favourites.length > 0;
        const option1Values = Array.from(new Set(variants.map(v => v.option_1Value)));
        const option2Values = Array.from(new Set(variants.map(v => v.option_2Value)));

        return NextResponse.json({
            product,
            isFavourite,
            option1Values,
            option2Values,
            reviews,
            relatedProducts,
            categories
        });
    } catch (err) {
        console.error('Error in /api/product/[id]:', err);
        return NextResponse.json({ error: 'Failed to fetch product data' }, { status: 500 });
    } finally {
        client.release();
    }
}
