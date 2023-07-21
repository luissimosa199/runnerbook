import { TimeLineEntryData } from "@/types";
import { FunctionComponent } from "react";

interface HeadMetaTagsProps {
    timeline?: TimeLineEntryData[];
    timelineName: string;
    timeLineUrl: string;
    message?: string;
    siteName: string;
}

const HeadMetaTags: FunctionComponent<HeadMetaTagsProps> = ({ timeline, timelineName, timeLineUrl, message, siteName }) => {

    return (
        <>
            <meta property="og:title" content={`${message} ${timelineName}`} />
            <meta name="twitter:title" content={`${message} ${timelineName}`} />
            <meta property="og:description" content={`${message} ${timelineName}`} />
            <meta name="twitter:description" content={`${message} ${timelineName}`} />
            <meta property="og:type" content="website" />
            {/* {timeline && <meta property="og:image" content={timeline[0].url} />} */}
            <meta property="og:image:type" content="image/jpeg" />
            {/* {timeline && <meta name="twitter:image" content={timeline[0].url} />} */}
            <meta property="og:url" content={`${timeLineUrl}`} />
            <meta property="og:site_name" content={siteName} />
        </>
    )
}

export default HeadMetaTags;