import { FunctionComponent } from "react";
import TimeLineEntry from "./TimeLineEntry";
import { TimeLineEntryData, TimeLineProps } from "@/types";
import { useRouter } from "next/router";
import Head from "next/head";
import ShareButtons from "./ShareButtons";
import HeadMetaTags from "./HeadMetaTags";
import formatDateString from "@/utils/formatDateString";
import Link from "next/link";

const TimeLine: FunctionComponent<TimeLineProps> = ({ timeline, length, mainText, createdAt, tags, _id }) => {

    const baseUrl = "https://doxa-board.vercel.app"
    const router = useRouter()
    const timeLineUrl = baseUrl + router.pathname

    return (
        <div className="mb-4 max-w-[850px] mx-auto">
            <Head>
                <HeadMetaTags
                    timeline={timeline}
                    timelineName={mainText || ''}
                    timeLineUrl={timeLineUrl}
                    message="Mira mi TimeLine"
                    siteName="doxa-board"
                />
            </Head>
            <div className="">
                <div className="flex gap-4">
                    <h1 className="ml-1 text-lg">{mainText}</h1>
                    <Link href={`/timeline/edit/${_id}`}>E</Link>
                    <Link href={`/timeline/delete/${_id}`} className="ml-auto mr-2	">B</Link>
                </div>
                <p className="ml-1 text-left text-xs">
                    {tags && tags.length > 0 && tags.join(', ')}
                </p>
                <p className="ml-1 text-left">{formatDateString(createdAt)}</p>
                <ShareButtons url={timeLineUrl} title={` Te comparto este timeline: ${mainText} `} />
            </div>
            {timeline && timeline.map((e: TimeLineEntryData,) =>
                <TimeLineEntry
                    key={e.idx}
                    length={length}
                    idx={e.idx}
                    data={e}
                />)
            }
        </div>
    )
}



export default TimeLine;