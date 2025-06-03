'use client'
import React, {useEffect, useState} from 'react';
import Conversation from "@/components/Conversation";
import {GetMessagesByConversationIdRow} from "@/db/goqueries/query_sql";
import {useSession} from "next-auth/react";
import {useParams} from "next/navigation";

function Page() {
    const [selectedMesseges, setSelectedMesseges] = useState<GetMessagesByConversationIdRow[] | undefined>([])
    const { data: session } = useSession()
    const user = session?.user;
    const params = useParams();

    useEffect(() => {
        const fetchInitial = async () => {
            const res = await fetch(`/api/messenger/UpdateMessages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    convId: params.convId,
                }),
            });
            const data = await res.json();
            setSelectedMesseges(data.messages.map((item: GetMessagesByConversationIdRow ) => {
                if(user && item.email == user.email){
                    item.email = "current"
                }
                return item
            }))
        };

        fetchInitial()
    }, [user]);

    return (
        <div>
            <Conversation
                messages={selectedMesseges}
                setMessages={setSelectedMesseges}
                conversationId={params.convId ? parseInt(params?.convId as string) : undefined}
                conversationName={"Hello"}
            />
        </div>
    );
}

export default Page;