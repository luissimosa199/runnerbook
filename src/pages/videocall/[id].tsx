import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ContextProvider } from '@/hooks/VideoCallContext';

import dynamic from 'next/dynamic';

const VideocallPage = dynamic(() => import('../../components/VideoCallPage'), {
  ssr: false
});

const VideoCall = () => {

    const router = useRouter();
    const roomId = router.query.id;
    const { data: session } = useSession()

    if (!roomId && !session) {
        return <p>Cargando...</p>;
    }

    return (
        <div>
            <ContextProvider>
                <VideocallPage roomId={roomId as string} session={session!} />
            </ContextProvider>
        </div>
    )
}

export default VideoCall