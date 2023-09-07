import React, { useContext, useEffect } from 'react';
import { SocketContext } from '@/hooks/VideoCallContext';
import VideoCallPlayer from '@/components/VideoCallPlayer';
import VideoCallNotification from '@/components/VideoCallNotification';
import VideoCallSidebar from '@/components/VideoCallSideBar';
import { Session } from 'next-auth';
import { ChatMessage } from '@/types';

const VideocallPage = ({ roomId, session }: { roomId: string, session: Session }) => {

    const context = useContext(SocketContext);

    useEffect(() => {
        if (roomId) {
            setRoomName(roomId as string)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId])


    if (!context) {
        throw new Error("You must use this component within a <ContextProvider>");
    }

    const { usersInRoom, messages, message, sendMessage, setMessage, toggleCamera, cameraIsOpen, setRoomName } = context

    if (
        // !session || 
        !roomId) {
        return <p>Cargando...</p>;
    }

    return (
        <div className="flex flex-col p-12 bg-gray-100 min-h-screen">

            {/* Open Camera Button */}
            <button
                onClick={(e) => { e.preventDefault(); toggleCamera(); }}
                className="mb-4 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
            >
                {cameraIsOpen ? "Cerrar cámara" : "Abrir cámara"}
            </button>

            {/* Video Call Player */}
            <div className="mb-4">
                {cameraIsOpen && <VideoCallPlayer />}
            </div>

            {/* Video Call Sidebar */}
            <div className="mb-4">
                <VideoCallSidebar>
                    <VideoCallNotification />
                </VideoCallSidebar>
            </div>

            {/* Chat Display */}
            <div className="chat-display mt-6 border p-4 bg-white rounded-md mb-4 overflow-y-auto" style={{ maxHeight: '200px' }}>
                {usersInRoom.map(({ name }, index) => (
                    <div key={index} className="mb-2">
                        <strong className="text-blue-500">{name === session!.user!.name ? "Yo" : name}</strong>
                    </div>
                ))}
            </div>

            {/* Messages */}
            <div className="messages mb-4 overflow-y-auto" style={{ maxHeight: '200px' }}>
                {messages.map((e: ChatMessage, idx) => {
                    return (
                        <div key={idx} className="mb-2 p-2 bg-gray-200 rounded-md">
                            <p><strong className="text-blue-500">{e.username}</strong>: {e.message}</p>
                        </div>
                    )
                })}
            </div>

            {/* Message Input */}
            <div className="mt-6 flex items-center">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    className="flex-grow p-2 border rounded-md focus:outline-none focus:border-blue-500"
                />

                <button
                    onClick={sendMessage}
                    className="ml-2 py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none"
                >
                    Enviar
                </button>
            </div>
        </div>

    );
};

export default VideocallPage;
