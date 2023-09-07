import React, { useContext } from 'react';
import { SocketContext } from "../hooks/VideoCallContext"

const VideoCallPlayer: React.FC = () => {


    const context = useContext(SocketContext);

    if (!context) {
        throw new Error("You must use VideoPlayer within a <ContextProvider>");
    }

    const { callAccepted, myVideo, userVideo, callEnded, stream } = context;

    return (
        <div className="flex flex-col md:flex-row justify-center items-end space-y-4 md:space-y-0 md:space-x-4">
            {callAccepted && !callEnded && (
                <div className="w-full">
                    <video playsInline ref={userVideo} autoPlay className="w-full rounded-md shadow-md" />
                </div>
            )}
            {stream && (
                <div className="">
                    <video playsInline muted ref={myVideo} autoPlay className="w-48 md:w-96 rounded-md shadow-md" />
                </div>
            )}
        </div>
    );
};

export default VideoCallPlayer;
