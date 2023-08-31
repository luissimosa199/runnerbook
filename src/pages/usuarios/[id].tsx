import dbConnect from "@/db/dbConnect"
import { UserModel } from "@/db/models/userModel"
import { User } from "@/types"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { GetServerSidePropsContext } from "next"
import Image from "next/image"
import Link from "next/link"
import { FunctionComponent } from "react"
import escapeStringRegexp from 'escape-string-regexp';
import UserPhotos from "@/components/UserPhotos"

interface UserPageProps {
    userData: User | null
}

const User: FunctionComponent<UserPageProps> = ({ userData }) => {

    return (
        <div className="p-8 bg-gray-50 space-y-12">
            <div className="flex gap-2 items-center">
                <Link href="/usuarios" className="w-4 h-4">
                    <FontAwesomeIcon icon={faArrowLeft} />
                </Link>
                <h1 className="text-4xl font-bold text-gray-800 border-b-2 pb-3">{userData?.name}</h1>
            </div>
            <div className="flex flex-col md:flex-row justify-around items-center border rounded-lg p-6 bg-white shadow-lg">
                <div className="flex flex-col items-center relative">
                    <div className="flex flex-col items-center">
                        <Image
                            priority
                            src={(userData?.image as string) || '/noprofile.png'}
                            width={128}
                            height={128}
                            alt={`${userData?.name}'s Avatar`}
                            className="w-32 h-32 object-cover rounded-full border-2 border-gray-300 mb-5"
                        />
                    </div>
                </div>

                <div>
                    <UserPhotos username={userData?.email as string} direction="flex-col" />
                </div>

            </div>
        </div>
    )
}

export default User

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    try {
        await dbConnect();

        const { id } = context.query;
        const safeId = escapeStringRegexp(id as string);

        const user = await UserModel.findOne({ email: new RegExp("^" + safeId) }).select("name email image photos").lean();

        if (user) {
            const userData = {
                name: user.name,
                email: user.email,
                image: user.image || "",
                photos: user.photos || [],
            }
            return {
                props: {
                    userData,
                },
            };
        }

        throw new Error('error')

    } catch (error) {
        console.error(error);
        return {
            notFound: true,
        };
    }
}