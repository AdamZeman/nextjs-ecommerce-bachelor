import {NextRequest, NextResponse} from 'next/server';
import { getDbConnection } from '@/lib/db';
import {
    getOpenConversationById, insertConversation, insertConversationUser, insertMessage, updateOrderStatus

} from '@/db/goqueries/query_sql';

export async function POST(req: NextRequest) {
    const client = await getDbConnection();

    try {
        const body = await req.json();
        const orderId = parseInt(body.id);
        const userId = parseInt(body.userId);

        const conversations = await getOpenConversationById(client, {
            orderId:orderId,
            status:"issue"
        });

        if (conversations.length > 0){
            return NextResponse.json({
                change: false,
            });
        }
        const insertedConversation = await insertConversation(client, {
            orderId: orderId,
            name: "#"+orderId
        });

        if (!insertedConversation){
            return NextResponse.json({
                change: false,
            });
        }

        await insertConversationUser(client, {
            conversationId:insertedConversation.id,
            userId:userId
        });

        await insertConversationUser(client, {
            conversationId:insertedConversation.id,
            userId:2
        });

        await insertMessage(client, {
            conversationId: insertedConversation.id,
            email:"zeman5698@gmail.com",
            content: "Initiated new issue regarding order number #"+ orderId
        });

        await updateOrderStatus(client,{
            id: orderId,
            status: "issue"
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
