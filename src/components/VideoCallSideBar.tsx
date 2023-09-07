import React, { useState, useContext } from 'react';
import { SocketContext } from '../hooks/VideoCallContext';

type SidebarProps = {
    children: React.ReactNode;
};

const VideoCallSidebar: React.FC<SidebarProps> = ({ children }) => {

    const context = useContext(SocketContext);

    if (!context) {
        throw new Error("You must use VideoPlayer within a <ContextProvider>");
    }

    const { callAccepted, callEnded, leaveCall, callRoom, call } = context;

    return (
        <div className="flex justify-center p-8">
            <div className="rounded-md w-full max-w-xl">
                <form className="flex flex-col">
                    <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
                        <div className="flex flex-col space-y-4">

                            {callAccepted && !callEnded ? (
                                <button
                                    onClick={(e) => { e.preventDefault(); leaveCall() }}
                                    className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 focus:outline-none"
                                >
                                    Finalizar llamada
                                </button>
                            ) : (
                                <>
                                    {!call.isReceivingCall &&
                                        <><h6 className="text-lg font-medium">Iniciar llamada</h6>
                                            <button
                                                onClick={(e) => { e.preventDefault(); callRoom() }}
                                                className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none"
                                            >
                                                Llamar
                                            </button></>}
                                </>
                            )}
                        </div>
                    </div>
                </form>
                {children}
            </div>
        </div>
    );
};

export default VideoCallSidebar;
