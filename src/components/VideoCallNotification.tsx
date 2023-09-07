import React, { useContext } from 'react';
import { SocketContext } from '../hooks/VideoCallContext';

const Notifications = () => {

    const context = useContext(SocketContext);

    if (!context) {
        throw new Error("You must use VideoPlayer within a <ContextProvider>");
    }

    const { answerCall, call, callAccepted, name } = context;

    return (
        <>
            {call.isReceivingCall && !callAccepted && (
                <div className="flex justify-between items-center mt-4">
                    {call.name === name ? <p className="text-center text-xl font-semibold w-full">Llamando...</p> : <>
                        <h1 className="text-xl font-bold">{call.name} quiere iniciar una llamada:</h1>
                        <button
                            onClick={answerCall}
                            className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                        >
                            Aceptar llamada
                        </button></>}

                </div>
            )}
        </>
    );
};

export default Notifications;
