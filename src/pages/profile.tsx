import { useSession } from "next-auth/react"
import LastTenUserTimeline from "@/components/LastTenUserTimeline"
import UserPhotoGallery from '@/components/UserPhotoGallery';
import ProfileCard from '@/components/ProfileCard';
import { useRouter } from "next/router";
import Navbar from "@/components/NavBar";

const Profile = () => {

    const router = useRouter();
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
            <>
                <div className="p-8 bg-gray-50 space-y-12">
                    <h1 className="text-4xl font-bold mb-10 text-gray-800 border-b-2 pb-3">Perfil</h1>
                    <ProfileCard />
                    <UserPhotoGallery />
                    <div className="mt-6">
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b-2 pb-2">Últimas publicaciones</h2>
                        <LastTenUserTimeline username={session.user.email as string} />
                    </div>
                </div>
            </>
        )
    }

    if (!session || !session.user) {
        router.push('/login');
        return null;
    }
}

export default Profile