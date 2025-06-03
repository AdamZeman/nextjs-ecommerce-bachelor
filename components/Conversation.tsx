'use client'
import React, {useState, useEffect} from 'react';
import Message from "@/components/Message";
import {GetMessagesByConversationIdRow} from "@/db/goqueries/query_sql";
import {useSession} from "next-auth/react";
import {formatDate} from "@/lib/shared";

type PropsType = {
    messages : GetMessagesByConversationIdRow[] | undefined,
    setMessages : React.Dispatch<React.SetStateAction<GetMessagesByConversationIdRow[] | undefined>>,
    conversationName : string | undefined,
    conversationId : number | undefined,
}

function Conversation({messages, setMessages, conversationName="", conversationId}:PropsType) {
    const [input, setInput] = useState('');
    const [ws, setWs] = useState(null);

    const { data: session } = useSession()
    const user = session?.user;

    useEffect(() => {
        if (!user || !user.email) return;

        const socket = new WebSocket('ws://localhost:3001');

        socket.onopen = () => {
            console.log('Connected to WebSocket');
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            setWs(socket);
        };

        socket.onmessage = (event) => {
            try {
                const receivedData = JSON.parse(event.data);
                const userType = user.email === receivedData.email ? "current" : user.email

                const newData: GetMessagesByConversationIdRow = {
                    id: 0,
                    conversationId: conversationId ?? 1,
                    senderId: 0,
                    createdAt: new Date(),
                    status: "",
                    readAt: new Date(),
                    content: receivedData.input,
                    email: userType as string
                };
                setMessages((prevMessages) => [...(prevMessages ?? []), newData]);
            } catch (error) {
                console.log(error);
                console.error('Failed to parse message:', event.data);
            }
        };

        socket.onclose = () => {
            console.log('Disconnected from WebSocket');
        };

        return () => {
            if (socket) socket.close();
        };
    }, [user]);

    const sendMessage = () => {
        const fetchData = async () => {
            await fetch(`/api/messenger/SendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: user?.email,
                    input: input,
                    convId: conversationId
                }),
            });
        };
        fetchData();

        const newData = {
            email: user?.email,
            input: input
        }

        if (ws && input) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            ws.send(JSON.stringify(newData));
            setInput('');
        }
    };

    return (
        <div className="flex flex-col h-[800px] rounded-lg">
            {/* Chat Header */}
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                    <div className="ml-3">
                        <p className="font-semibold">Chat Room {conversationName}</p>
                        <p className="text-sm">Active now</p>
                    </div>
                </div>
                <div className="flex space-x-4">
                    <button className="hover:text-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Chat Messages Area */}
            <div
                className="flex-1 flex flex-col p-4 space-y-4 justify-between overflow-y-auto"
            >
                <div id="chat-room" className="space-y-4">
                    {messages?.map((msg, index) => (
                        <Message key={index} msg={msg.content} scroll={true} timestamp={formatDate(msg.createdAt)} userType={msg.email}/>
                    ))}
                </div>

                {/* Chat Input Box */}
                <form
                    className="flex items-center"
                    onSubmit={(e) => {
                        e.preventDefault();
                        sendMessage();
                    }}
                >
                    <input
                        id="chat_input"
                        name="chat_message"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-800"
                    />
                    <button
                        onClick={sendMessage}
                        type={"submit"}
                        className="ml-4 bg-masala-950 text-white p-2 rounded-lg hover:bg-masala-950 focus:outline-none"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor" className="h-6 w-6">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"/>
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Conversation;