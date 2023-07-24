import { useQueryClient } from "react-query";
import { TimeLineEntryData, TimelineFormInputs } from "@/types";
import { getCurrentDateTimeString } from "@/utils/formHelpers";

interface OptimisticUpdateParams {
  data: Omit<TimelineFormInputs, "_id" | "createdAt">;
  images: string[];
}

interface Caption {
  idx: number;
  value: string;
}

const useOptimisticUpdate = (imagesCaption: Caption[], tagsList: string[]) => {
  const queryClient = useQueryClient();

  return ({ data, images }: OptimisticUpdateParams) => {
    queryClient.cancelQueries("timelines");

    const currentData = queryClient.getQueryData<{
      pages: TimelineFormInputs[][];
      pageParams: any[];
    }>("timelines");

    const currentPhotos: TimeLineEntryData[] = images.map(
      (image, photoIdx: number) => {
        const caption = imagesCaption.find((e) => e.idx === photoIdx)?.value;
        return {
          url: image,
          idx: photoIdx,
          caption: caption,
        };
      }
    );

    const newData: TimelineFormInputs = {
      _id: "newitem",
      createdAt: getCurrentDateTimeString(),
      mainText: data.mainText || "",
      photo: currentPhotos,
      length: currentPhotos.length,
      tags: tagsList,
    };

    if (currentData) {
      queryClient.setQueryData<{
        pages: TimelineFormInputs[][];
        pageParams: any[];
      }>("timelines", {
        ...currentData,
        pages: [
          [newData, ...currentData.pages[0]],
          ...currentData.pages.slice(1),
        ],
      });
    }

    return { previousData: currentData };
  };
};

export default useOptimisticUpdate;
