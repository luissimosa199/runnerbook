import Image from "next/image";
import { ChangeEvent, FunctionComponent, useState } from "react";
import { useForm } from "react-hook-form";
import { TimelineFormInputs } from "@/types";
import { createDataObject, createPhotoData, handleCaptionChange, handleDeleteImage, handleFileChange, sendData, uploadImages } from "../utils/formHelpers";
import TagsInput from "./TagsInput";
import { useMutation, useQueryClient } from 'react-query';
import useOptimisticUpdate from "@/hooks/useOptimisticUpdate";

const TimelineForm: FunctionComponent = () => {
  const [images, setImages] = useState<string[]>([]);
  const [imagesCaption, setImagesCaptions] = useState<{ idx: number; value: string }[]>([]);
  const [tagsList, setTagsList] = useState<string[]>([]);
  const [submitBtnDisabled, setSubmitBtnDisabled] = useState<boolean>(false)
  const optimisticUpdate = useOptimisticUpdate(imagesCaption, tagsList);
  const [imageUploadPromise, setImageUploadPromise] = useState<Promise<any> | null>(null);
  const queryClient = useQueryClient();

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
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TimelineFormInputs>();

  const onSubmit = async (data: TimelineFormInputs) => {

    if (data.mainText === '' && data.photo?.length === 0) {
      console.log('EMPTY FORM')
      return
    }

    setSubmitBtnDisabled(true)
    const previewPhotos = createPhotoData(images, imagesCaption)
    const previewData = createDataObject(data, previewPhotos, tagsList)
    const { previousData } = optimisticUpdate({ data: previewData, images: images });

    setTagsList([])
    setImages([]);
    reset();

    console.log('1')

    if (imageUploadPromise) {
      const urls = await imageUploadPromise;
      const currentPhotos = createPhotoData(urls, imagesCaption)
      const processedData = createDataObject(data, currentPhotos, tagsList)
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
      setSubmitBtnDisabled(false)
    }
  };

  const handleFormKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  const handleUploadImages = async (event: ChangeEvent<HTMLInputElement>) => {
    setSubmitBtnDisabled(true);
    (await handleFileChange(event, setImages));
    setSubmitBtnDisabled(false);
    const uploadPromise = uploadImages(event);
    setImageUploadPromise(uploadPromise);
  };

  return (
    <form onKeyDown={handleFormKeyDown} onSubmit={handleSubmit(onSubmit)} className="border flex flex-col gap-2 p-4 rounded max-w-[850px] mx-auto">
      <h1 className="text-xl font-bold">Subir nuevo Timeline</h1>

      <div className="flex flex-col">
        <label htmlFor="mainText" className="relative flex flex-col">
          <textarea className="border rounded h-10 p-1" id="mainText" {...register("mainText")} />
        </label>
      </div>

      <div className="flex flex-col">
        <label htmlFor="photo" className="relative flex flex-col">
          Fotos:
          <input
            className="border rounded h-10 p-1"
            type="file"
            id="photo"
            multiple
            {...register("photo")}
            onChange={handleUploadImages}
          />
        </label>
        {errors.photo && <span className="text-red-500">Sube tus fotos</span>}
      </div>

      <TagsInput tagsList={tagsList} setTagsList={setTagsList} />

      {images.length > 0 && (
        <div className="flex flex-col">
          {images.map((e, idx) => (
            <div key={idx}>
              <button className="text-xs" onClick={(event) => handleDeleteImage(event, idx, setImages)}>
                Borrar
              </button>
              <Image src={e} alt={`Thumbnail ${idx}`} className="mt-2" width={834} height={834} />
              <input
                className="border w-full mb-1 p-1 placeholder:text-sm "
                placeholder="Agrega un texto a esta foto"
                type="text"
                onChange={(event) => handleCaptionChange(event, idx, imagesCaption, setImagesCaptions)}
              />
            </div>
          ))}
        </div>
      )}

      <button disabled={submitBtnDisabled} className={` ${submitBtnDisabled ? "bg-blue-300" : "bg-blue-500"} text-white px-4 py-2 rounded`} type="submit">
        Enviar
      </button>
    </form>
  );
};

export default TimelineForm;
