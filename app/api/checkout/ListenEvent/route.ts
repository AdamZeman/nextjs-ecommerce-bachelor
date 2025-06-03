import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getDbConnection } from '@/lib/db';
import {
    getBasketItemsByUserEmail,
    insertOrder,
    insertOrderItem,
    deleteItemsFromBasket, GetBasketItemsByUserEmailRow, getLatestShippingByUserId,
} from '@/db/goqueries/query_sql';

const stripe = new Stripe(process.env.STRIPE_KEY!);

export async function POST(req: NextRequest) {
    const client = await getDbConnection();

    try {
        const body = await req.text();
        const event = JSON.parse(body) as Stripe.Event;

        if (event.type === 'charge.succeeded') {
            const charge = event.data.object as Stripe.Charge;
            const customerId = charge.customer;

            const customer = await stripe.customers.retrieve(customerId as string) as Stripe.Customer;
            const email = customer.metadata?.FinalEmail;

            if (!email) {
                return NextResponse.json({ error: 'Missing email in customer metadata' }, { status: 400 });
            }

            const basketItems = await getBasketItemsByUserEmail(client, { email });
            const totalPrice = basketItems.reduce((sum: number, item:  GetBasketItemsByUserEmailRow) => sum + item.price * item.quantity, 0);

            const latestShipping = await getLatestShippingByUserId(client, {
                email
            })

            if (!latestShipping){
                return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
            }

            const newOrder = await insertOrder(client, {
                userId: basketItems[0].userId,
                totalPrice,
                shippingId: latestShipping?.id
            });

            if(!newOrder){
                return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
            }

            for (const item of basketItems) {
                await insertOrderItem(client, {
                    orderId: newOrder.id,
                    productVariantId: item.productVariantId,
                    quantity: item.quantity,
                });
                await deleteItemsFromBasket(client, {
                    id: item.id});
            }
        }

        return NextResponse.json({ status: 'Event processed' });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
    }
}
