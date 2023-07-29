import { FunctionComponent } from "react";
import Image from "next/image";
import { TimeLineEntryProps } from "@/types";

const TimeLineEntry: FunctionComponent<TimeLineEntryProps> = ({ data, idx, length }) => {

    return (
        <div className="mt-4 border-2 w-fit p-2 mx-auto bg-white">
            <div className="w-full">
                <Image
                    className="rounded mx-auto"
                    src={data.url}
                    alt={data.caption || 'image'}
                    width={850}
                    height={850}
                    priority={idx === 0}
                />
            </div>
            <p className="text-base text-gray-500 mt-2">{data.caption}</p>
            {idx + 1 !== length && <div className="absolute">
                <span className="relative text-lg font-extrabold top-[1px] -z-10 text-green-500 h-12">↓</span>
            </div>}
        </div>
    )
}

export default TimeLineEntry;