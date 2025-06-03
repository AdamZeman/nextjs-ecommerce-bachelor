import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import {getBasketItemsByUserEmail, GetBasketItemsByUserEmailRow, insertShipping} from "@/db/goqueries/query_sql";
import {getDbConnection} from "@/lib/db";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/options";

const stripe = new Stripe(process.env.STRIPE_KEY!)

export async function POST(req: NextRequest) {
    const client = await getDbConnection();
    const sessionUser = await getServerSession(authOptions);
    if (!sessionUser?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const email = sessionUser.user.email;
        const userId = sessionUser.user.id;
        const body = await req.json()

        const Address = body.address
        const HouseNumber = body.houseNumber
        const phoneNumber = body.phoneNumber
        const City = body.city
        const Notes = body.notes
        const postalCode = body.postalCode

        await insertShipping(client,{
            userId: userId,
            phoneNumber: phoneNumber,
            address: Address,
            houseNumber: HouseNumber,
            postalCode: postalCode,
            city: City,
            notes: Notes,
        });

        if(!email){
            return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
        }

        const basketItems = await getBasketItemsByUserEmail(client,{
            email:email
        });

        const customer = await stripe.customers.create({
            email,
            metadata: {
                FinalEmail: email,
            },
        });

        const line_items = basketItems.map((item: GetBasketItemsByUserEmailRow) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name,
                    description: 'Description of the product',
                },
                unit_amount: item.price,
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer: customer.id,
            line_items,
            mode: 'payment',
            success_url: process.env.DEFAULT_URL + '/orders',
            cancel_url: process.env.DEFAULT_URL + '/orders',
        });

        return NextResponse.json({
            id: session.id,
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
    }
}