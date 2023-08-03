import { FunctionComponent } from "react";
import TimeLineEntry from "./TimeLineEntry";
import { TimeLineEntryData, TimeLineProps } from "@/types";
import Head from "next/head";
import ShareButtons from "./ShareButtons";
import HeadMetaTags from "./HeadMetaTags";
import formatDateString from "@/utils/formatDateString";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import Link from "next/link";

const TimeLine: FunctionComponent<TimeLineProps> = ({ timeline, length, mainText, createdAt, tags, _id, authorId, authorName }) => {

    const baseUrl = "https://doxa-board-dev.vercel.app"
    const timeLineUrl = baseUrl + `/timeline/${_id}`

    return (
        <div className="mb-4 max-w-[850px] mx-auto">
            <Head>
                <HeadMetaTags
                    timeline={timeline}
                    timelineName={mainText?.slice(0, 50) || ''}
                    timeLineUrl={timeLineUrl}
                    message="Comparte con Doxa-Board"
                    siteName="doxa-board"
                />
            </Head>
            <div className="bg-white shadow-md rounded-lg p-4">
                <div className="text-left">
                {mainText && mainText.split('\n').map((paragraph, idx) => (
                    <p key={idx} className={mainText.length > 300 ? "text-md font-normal mb-2" : "text-xl font-semibold mb-2"}>{paragraph}</p>
                    ))}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                    {tags && tags.length > 0 && tags.join(', ')}
                </p>
                <p className="text-sm text-gray-500">{formatDateString(createdAt)}</p>
                <p className="text-sm text-gray-500">{authorName}</p>
                <div className="mt-4 flex justify-between items-center">
                    <ShareButtons url={timeLineUrl} title={`${mainText?.slice(0, 50)}`} />
                    {_id !== "newitem" && <Link
                        className="text-blue-500 hover:text-blue-700 transition ease-in-out duration-150"
                        href={`/timeline/edit/${_id}`}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} size="lg" />
                    </Link>}
                </div>
                <div className="mt-6">
                    {timeline && timeline.map((e: TimeLineEntryData,) =>
                        <TimeLineEntry
                            key={e.idx}
                            length={length}
                            idx={e.idx}
                            data={e}
                        />)
                    }
                </div>
            </div>
        </div>
    )
}



export default TimeLine;