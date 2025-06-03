import {  NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/db';
import {
    getOrderItemsByUserId,
    getOrdersByUserId

} from '@/db/goqueries/query_sql';
import {OrderFilled} from "@/types/next-auth";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/options";

export async function GET() {
    const client = await getDbConnection();
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const userId = session.user.id;

        const orderItems = await getOrderItemsByUserId(client, {
            userId:userId
        });
        const ordersDB = await getOrdersByUserId(client, {
            userId:userId
        });
        const ordersFilled: OrderFilled[] = ordersDB.map(orderDB => ({
            order: orderDB,
            orderItems: orderItems.filter(item => item.orderId === orderDB.id)
        }));
        return NextResponse.json({
            ordersFilled,
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    } finally {
        client.release();
    }
}
