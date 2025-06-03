import {  NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/db';
import {
    getConversationsByUserId,
    getMessagesByConversationId

} from '@/db/goqueries/query_sql';
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/options";

export async function GET() {
    const client = await getDbConnection();
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const email = session.user.email;
        if(!email){
            return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
        }

        const conversations = await getConversationsByUserId(client, {
            email:email
        });

        const messages = await getMessagesByConversationId(client, {
            id:conversations[0].id
        });

        const updatedMessages = messages.map(msg => {
            if (msg.email === 'zeman5698@gmail.com') {
                return { ...msg, email: 'current' };
            }
            return msg;
        });

        return NextResponse.json({
            updatedMessages,
            conversations
        });
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    } finally {
        client.release();
    }
}
