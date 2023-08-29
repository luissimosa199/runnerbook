import React, { useEffect, useState } from 'react'
import { JitsiMeeting } from '@jitsi/react-sdk';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const Videocall = () => {

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
    const { data: session } = useSession()
    const [isPageLoaded, setPageLoaded] = useState<boolean>(false)
    const router = useRouter()
    const roomId = router.query.id

    useEffect(() => {
        setPageLoaded(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!isPageLoaded || !session || !roomId) {
        return (
            <p>Cargando...</p>
        );
    }

    return (
        <div>
            <JitsiMeeting
                // domain={YOUR_DOMAIN}
                roomName={roomId as string}
                configOverwrite={{
                    startWithAudioMuted: true,
                    disableModeratorIndicator: true,
                    startScreenSharing: true,
                    enableEmailInStats: false
                }}
                interfaceConfigOverwrite={{
                    DISABLE_JOIN_LEAVE_NOTIFICATIONS: true
                }}
                userInfo={{
                    displayName: session?.user?.name || 'Tu nombre',
                    email: session?.user?.email || 'Tu email'
                }}
                onApiReady={(externalApi) => {
                    console.log(externalApi)
                }}
                getIFrameRef={(iframeRef) => { iframeRef.style.height = 'calc(100vh - 100px)'; }}
            />
            <div className="p-2">
                <p>Comparte este Link con tus invitados</p>
                <p>{`${BASE_URL}/videocall/invitacion/${roomId}`}</p>
            </div>
        </div>
    )
}

export default Videocall