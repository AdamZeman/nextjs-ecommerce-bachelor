import {NextRequest, NextResponse} from 'next/server';
import { getDbConnection } from '@/lib/db';
import {
    insertReview

} from '@/db/goqueries/query_sql';
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/options";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const client = await getDbConnection();
    try {
        const body = await req.json();
        const ProductID = body.productId;
        const Rating = body.rating;
        const Content = body.content;
        const userId = session.user.id;

        await insertReview(client,{
            senderId: userId,
            productId: ProductID,
            rating: Rating,
            content: Content
        });

        return NextResponse.json({
            change: true,
        });

    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    } finally {
        client.release();
    }
}
