import { TimelineFormInputs } from '@/types'
import formatDateString from '@/utils/formatDateString'
import { CldImage } from 'next-cloudinary'
import { FunctionComponent } from 'react'
import { useQuery } from 'react-query'

interface LastTenUserTimelineProps {
    username: string
}

const LastTenUserTimeline: FunctionComponent<LastTenUserTimelineProps> = ({ username }) => {

    const fetchUserTimelines = async () => {
        const response = await fetch(`/api/user/timelines/?username=${encodeURIComponent(username)}&page=0`, {
            method: 'GET'
        });
        const data = await response.json()
        return data
    }

    const { data, isLoading, isError } = useQuery([username, 'userTimelines'], fetchUserTimelines)

    if (isLoading) {
        return (
            <div>Cargando...</div>
        )
    }

    if (isError) {
        return (
            <div>Error</div>
        )
    }

    return (
        <div className="mt-4 bg-white p-6 rounded-lg shadow-md">
            {data && data.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                    {data.map((e: TimelineFormInputs, idx: number) => (
                        <li key={idx} className="py-4 space-y-4">
                            <p className="text-lg text-gray-600">{formatDateString(e.createdAt)}</p>

                            {e.mainText && <p className="text-xl mb-4 font-semibold">{e.mainText}</p>}

                            {e.photo && e.photo.length > 0 && (
                                <div className="flex gap-2">
                                    {e.photo.map((image: any, imageIdx: number) => (
                                        <div key={imageIdx} className="w-fit overflow-hidden rounded">
                                            <CldImage src={image.url} alt={image.caption || 'Timeline Image'} width={200} height={200} />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {e.links && e.links.length > 0 && (
                                <div className="flex flex-col gap-2">
                                    {e.links.map((link: string) => (
                                        <a
                                            key={link}
                                            href={link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-300 text-blue-600 hover:text-blue-800 font-medium break-words"
                                        >
                                            {link}
                                        </a>
                                    ))}
                                </div>
                            )}

                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-500 mt-4">No has realizado tu primer Timeline</p>
            )}
        </div>

    )
}

export default LastTenUserTimeline