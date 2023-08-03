import Image from "next/image";
import { ChangeEvent, FunctionComponent, useState } from "react";
import { useForm } from "react-hook-form";
import { TimelineFormInputs } from "@/types";
import { createDataObject, createPhotoData, handleCaptionChange, handleDeleteImage, handleFileChange, sendData, uploadImages } from "../utils/formHelpers";
import TagsInput from "./TagsInput";
import { useMutation, useQueryClient } from 'react-query';
import useOptimisticUpdate from "@/hooks/useOptimisticUpdate";
import PhotoInput from "./PhotoInput";
import { useSession } from "next-auth/react"

const TimelineForm: FunctionComponent = () => {
  const [images, setImages] = useState<string[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [imagesCaption, setImagesCaptions] = useState<{ idx: number; value: string }[]>([]);
  const [tagsList, setTagsList] = useState<string[]>([]);
  const [submitBtnDisabled, setSubmitBtnDisabled] = useState<boolean>(false)
  const [imageUploadPromise, setImageUploadPromise] = useState<Promise<any> | null>(null);
  const queryClient = useQueryClient();

  const { data: session } = useSession();
  const optimisticUpdate = useOptimisticUpdate(imagesCaption, tagsList, session);

  const mutation = useMutation(
    async ({ data, urls }: { data: Omit<TimelineFormInputs, "_id" | "createdAt">; urls: string[] }) => {
      const payload = {
        ...data,
        photo: urls.map((url, photoIdx: number) => {
          const caption = imagesCaption.find((e) => e.idx === photoIdx)?.value;
          return {
            url: url,
            idx: photoIdx,
            caption: caption,
          };
        }),
      };

      return sendData(payload);
    },
    {
      onSuccess: async (data) => {

        const currentData = queryClient.getQueryData<{
          pages: TimelineFormInputs[][];
          pageParams: any[];
        }>("timelines") || { pages: [], pageParams: [] };

        const response = await data.json()

        const newPayload = {
          ...response,
          photo: previews.map((image, photoIdx: number) => {
            const caption = imagesCaption.find((e) => e.idx === photoIdx)?.value;
            return {
              url: image,
              idx: photoIdx,
              caption: caption,
            };
          }),
        };

        queryClient.setQueryData<{
          pages: TimelineFormInputs[][];
          pageParams: any[];
        }>("timelines", {
          ...currentData,
          pages: [
            [newPayload, ...currentData.pages[0].slice(1)],
            ...currentData.pages.slice(1),
          ],
          pageParams: currentData.pageParams // Explicitly passing pageParams, ensuring it's not undefined
        });

        setPreviews([])
      }

    }
  );


  const {
    register,
    handleSubmit,
    reset,
  } = useForm<TimelineFormInputs>();

  const onSubmit = async (data: TimelineFormInputs) => {

    if (data.mainText === '' && data.photo?.length === 0) {
      return
    }

    setSubmitBtnDisabled(true)
    const previewPhotos = createPhotoData(images, imagesCaption)
    const previewData = createDataObject(data, previewPhotos, tagsList, session)
    const { previousData } = optimisticUpdate({ data: previewData, images: images });

    setTagsList([])
    setImages([]);
    reset();

    if (imageUploadPromise) {
      const urls = await imageUploadPromise;
      const currentPhotos = createPhotoData(urls, imagesCaption)
      const processedData = createDataObject(data, currentPhotos, tagsList, session)
      setImageUploadPromise(null);

      try {
        await mutation.mutateAsync({ data: processedData, urls })
      } catch (err) {
        if (previousData) {
          queryClient.setQueryData<{ pages: TimelineFormInputs[][], pageParams: any[] }>('timelines', previousData);
        }
        throw err
      }
    } else {
      try {
        await mutation.mutateAsync({ data: previewData, urls: [] })
      } catch (err) {
        if (previousData) {
          queryClient.setQueryData<{ pages: TimelineFormInputs[][], pageParams: any[] }>('timelines', previousData);
        }
        throw err
      }
    }
    setSubmitBtnDisabled(false)
  };

  const handleFormKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  const handleUploadImages = async (event: ChangeEvent<HTMLInputElement>) => {
    setSubmitBtnDisabled(true);
    (await handleFileChange(event, setImages, setPreviews));
    setSubmitBtnDisabled(false);
    const uploadPromise = uploadImages(event);
    setImageUploadPromise(uploadPromise);
  };

  return (
    <form onKeyDown={handleFormKeyDown} onSubmit={handleSubmit(onSubmit)} className="border-2 border-gray-300 flex flex-col gap-4 p-6 rounded max-w-[850px] mx-auto shadow-sm">
      <h1 className="text-2xl font-semibold mb-2">Subir nuevo Timeline</h1>

      <div className="flex flex-col">
        <label htmlFor="mainText" className="relative flex flex-col">
          <textarea placeholder="Escribe algo acá" className="border rounded h-32 p-3 text-md resize-none" id="mainText" {...register("mainText")} />
        </label>
      </div>

      <div className="flex flex-col">
        <PhotoInput handleUploadImages={handleUploadImages} register={register} />
      </div>

      <TagsInput tagsList={tagsList} setTagsList={setTagsList} />

      {images.length > 0 && (
        <div className="flex flex-col gap-2">
          {images.map((e, idx) => (
            <div key={idx}>
              <button className="text-xs text-red-500 mb-1" onClick={(event) => handleDeleteImage(event, idx, setImages, setPreviews)}>
                Borrar
              </button>
              <Image src={e} alt={`Thumbnail ${idx}`} className="mt-2 rounded shadow-md" width={834} height={834} />
              <input
                className="border w-full mb-1 p-2 placeholder:text-sm rounded-md"
                placeholder="Agrega un texto a esta foto"
                type="text"
                onChange={(event) => handleCaptionChange(event, idx, imagesCaption, setImagesCaptions)}
              />
            </div>
          ))}
        </div>
      )}

      <button disabled={submitBtnDisabled} className={` ${submitBtnDisabled ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"} text-white px-4 py-2 rounded`} type="submit">
        Enviar
      </button>
    </form>

  );
};

export default TimelineForm;
