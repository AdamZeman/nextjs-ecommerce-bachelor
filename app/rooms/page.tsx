'use client'
import React, { useState, useEffect } from 'react';
import Conversation from "@/components/Conversation";
import {useSession} from "next-auth/react";
import {GetConversationsByUserIdRow, GetMessagesByConversationIdRow} from "@/db/goqueries/query_sql";
import {formatDate} from "@/lib/shared";

function MessengerPage() {
    const [conversations, setConversations] = useState<GetConversationsByUserIdRow[]>( )
    const [selectedConversation, setSelectedConversation] = useState<GetConversationsByUserIdRow>();
    const [selectedMesseges, setSelectedMesseges] = useState<GetMessagesByConversationIdRow[]>()
    const [messages, setMessages] = useState<GetMessagesByConversationIdRow[]>()

    const { data: session } = useSession()
    const user = session?.user;

    const fetchInitial = async () => {
        const res = await fetch(`/api/rooms/ShowRooms`, {
            method: 'GET'
        });
        const data = await res.json();
        setConversations(data.conversations)

        if (data.conversations.length > 0) {
            setSelectedConversation(data.conversations[0]);
        } else {
            setSelectedConversation(undefined);
        }

        setMessages(data.updatedMessages)
        setSelectedMesseges(data.updatedMessages.map((item:GetMessagesByConversationIdRow ) => {
            if(user && item.email == user.email){
                item.email = "current"
            }
            return item
        }))
    };

    const updateMessages = async () => {
        const res = await fetch(`/api/messenger/UpdateMessages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                convId: selectedConversation?.id,
            }),
        });
        const data = await res.json();
        setSelectedMesseges(data.messages?.map((item: GetMessagesByConversationIdRow) => {
            if(user && item.email == user.email){
                item.email = "current"
            }
            return item
        }))
    };

    useEffect(() => {
        fetchInitial();
    }, []);

    useEffect(() => {
        if (messages){
            updateMessages();
        }
    }, [selectedConversation]);

    return (
        <div className="pb-4">
            <div className="flex gap-4 pb-6">
                <a
                    href="/orders"
                    className="w-1/3 border-gray-200 border-b-2 pb-4 text-center hover:border-gray-800 transition-all duration-300"
                >
                    Orders
                </a>
                <a
                    href="/favourites"
                    className="w-1/3 border-gray-200 border-b-2 pb-4 text-center hover:border-gray-800 transition-all duration-300"
                >
                    Favourites
                </a>
                <a
                    href="/rooms"
                    className="w-1/3 font-bold text-gray-800 border-gray-800 border-b-2 pb-4 text-center hover:opacity-80 transition-all duration-300"
                >
                    Messenger
                </a>
            </div>

            <div className="text-3xl font-bold">Messenger</div>
            <div className="my-4 border-gray-200 border w-full"></div>

            <div className="flex gap-2">
                {/* Conversations sidebar */}
                <div className="flex flex-col h-[800px] w-[300px] bg-masala-50">
                    <div className="text-2xl font-bold p-4">Recent</div>

                    {conversations && conversations.map(conversation => (
                        <label
                            key={conversation.id}
                            className={`flex items-center gap-4 p-4 hover:bg-masala-100 cursor-pointer transition-all duration-300 ${
                                selectedConversation?.id === conversation.id ? 'bg-masala-100' : ''
                            }`}
                            onClick={() => setSelectedConversation(conversation)}
                        >
                            <input
                                type="radio"
                                name="conversation-name"
                                className="absolute opacity-0 h-0 w-0"
                                checked={selectedConversation?.id === conversation.id}
                                onChange={() => {}}
                                value={conversation.name}
                            />

                            {/* Avatar */}
                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                                <span className="text-gray-600">
                                  {conversation.name}
                                </span>
                            </div>

                            {/* Timestamp */}
                            <div className="text-xs text-gray-400">
                                {formatDate(conversation?.createdAt)}
                            </div>
                        </label>
                    ))}
                </div>

                {/* Messages container */}
                <div id="messenger-container" className="flex-1">
                    {selectedConversation && (
                        <Conversation
                            messages={selectedMesseges}
                            setMessages={setSelectedMesseges}
                            conversationName={selectedConversation?.name}
                            conversationId={selectedConversation?.id}
                        />
                    )}

                </div>
            </div>

            <div className="my-4 border-gray-200 border w-full"></div>
        </div>
    );
}

export default MessengerPage;