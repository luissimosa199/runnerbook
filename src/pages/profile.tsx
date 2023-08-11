
import { useSession } from "next-auth/react"
import LastTenUserTimeline from "@/components/LastTenUserTimeline"
import Link from 'next/link';
import UserPhotoGallery from '@/components/UserPhotoGallery';
import ProfileCard from '@/components/ProfileCard';

const Profile = () => {

    const { data: session, status } = useSession()

    if (status === "loading") {
        return (
            <div className="border-2">
                <div className="text-center">Cargando datos de usuario...</div>
            </div>
        )
    }

    if (session && session.user) {
        return (
            <div className="p-8 bg-gray-50 space-y-12">
                <h1 className="text-3xl font-bold mb-8 text-gray-700">Perfil</h1>
                <ProfileCard />
                <UserPhotoGallery />
                <div>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700">Últimas publicaciones</h2>
                    <LastTenUserTimeline username={session.user.email as string} />
                </div>
            </div>
        )
    }

    return (
        <div className="border-2">
            <div className="text-center">Ingresa para ver tu perfil de usuario</div>
            <Link href="/login">Inicia Sesión</Link>
        </div>
    )
}

export default Profile