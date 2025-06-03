'use client'
import React from 'react';

type PropTypeInside = {
    userType: string,
    msg: string,
    timestamp: string | undefined
};
function Inside({ userType, msg, timestamp }: PropTypeInside ) {
    if (userType === "current") {
        return (
            <div className="flex justify-end">
                <div className="flex flex-col">
                    <div className="bg-masala-950 text-white p-3 rounded-lg max-w-xs">
                        <p>{msg}</p>
                    </div>
                    <span className="text-xs text-gray-500">{timestamp}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex">
            <div className="flex flex-col">
                <div className="bg-masala-50 p-3 rounded-lg max-w-xs">
                    <p className="text-gray-800">{msg}</p>
                </div>
                <span className="text-xs text-gray-500">{timestamp}</span>
            </div>
        </div>
    );
}

type PropsType = {
    userType: string,
    msg: string,
    timestamp: string | undefined,
    scroll: boolean
};

function Message({ userType, msg, timestamp, scroll }: PropsType) {
    const scrollChatToBottom = () => {
        const chatRoom = document.getElementById("chat-room");
        if (chatRoom) {
            chatRoom.scrollTop = chatRoom.scrollHeight;
        }
    };

    if (scroll) {
        setTimeout(scrollChatToBottom, 0);
    }

    return (
        <div>
            <Inside userType={userType} msg={msg} timestamp={timestamp} />
        </div>
    );
}

export default Message;
