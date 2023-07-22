import Link from "next/link";
import Image from "next/image";
import { ChangeEvent, FunctionComponent, useState } from "react";
import { useForm } from "react-hook-form";
import { TimelineFormInputs } from "@/types";
import { getCurrentDateTimeString, handleCaptionChange, handleDeleteImage, handleFileChange, sendData, uploadImages } from "../utils/formHelpers";
import TagsInput from "./TagsInput";
import { useMutation, useQueryClient } from 'react-query';

const TimelineForm: FunctionComponent = () => {
  const [images, setImages] = useState<string[]>([]);
  const [imagesCaption, setImagesCaptions] = useState<{ idx: number; value: string }[]>([]);
  const [imgsUrl, setImgsUrls] = useState<string[]>([]);
  const [tagsList, setTagsList] = useState<string[]>([]);
  const [submitBtnDisabled, setSubmitBtnDisabled] = useState<boolean>(false)
  const [loadingImgs, setLoadingImgs] = useState<boolean>(false)

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (data: Omit<TimelineFormInputs, "_id" | "createdAt">) => sendData(data),
    {
      onMutate: (data) => {
        queryClient.cancelQueries('timelines');

        const currentData = queryClient.getQueryData<{ pages: TimelineFormInputs[][], pageParams: any[] }>('timelines');

        const currentPhotos = imgsUrl.map((e, photoIdx: number) => {
          const caption = imagesCaption.find((e) => e.idx === photoIdx)?.value;
          return {
            url: e,
            idx: photoIdx,
            caption: caption,
          };
        });
        const currentPhotosWithUpdatedUrl = currentPhotos.map((photo) => ({
          ...photo,
          url: images[photo.idx],
        }));
        const newData = {
          _id: 'newitem',
          createdAt: getCurrentDateTimeString(),
          mainText: data.mainText || "",
          photo: currentPhotosWithUpdatedUrl,
          length: currentPhotos.length,
          tags: tagsList
        } as TimelineFormInputs

        if (currentData) {
          // The new data should be added to the first page
          queryClient.setQueryData<{ pages: TimelineFormInputs[][], pageParams: any[] }>('timelines', {
            ...currentData,
            pages: [[newData, ...currentData.pages[0]], ...currentData.pages.slice(1)],
          });
        }

        return { previousData: currentData };
      },

      onError: (error, variables, context) => {
        if (context?.previousData) {
          queryClient.setQueryData<{ pages: TimelineFormInputs[][], pageParams: any[] }>('timelines', context.previousData);
        }
      },
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TimelineFormInputs>();

  const onSubmit = async (data: TimelineFormInputs) => {
    setSubmitBtnDisabled(true)
    const currentPhotos = imgsUrl.map((e, photoIdx: number) => {
      const caption = imagesCaption.find((e) => e.idx === photoIdx)?.value;
      return {
        url: e,
        idx: photoIdx,
        caption: caption,
      };
    });

    const processedData = {
      mainText: data.mainText || "",
      photo: currentPhotos,
      length: currentPhotos.length,
      tags: tagsList
    };

    try {
      await mutation.mutateAsync(processedData)
      setTagsList([])
      setImages([]);
      setImgsUrls([]);
      reset();
    } catch (err) {
      throw err
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
    setLoadingImgs(true);
    await handleFileChange(event, setImages);
    await uploadImages(event, setImgsUrls);
    setSubmitBtnDisabled(false);
    setLoadingImgs(false);
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

      {loadingImgs && <p className="my-2">Subiendo imágenes...</p>}

      {images.length > 0 && (
        <div className="flex flex-col">
          {images.map((e, idx) => (
            <div key={idx}>
              <button className="text-xs" onClick={(event) => handleDeleteImage(event, idx, setImgsUrls, setImages)}>
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

      <button disabled={submitBtnDisabled} className={` ${submitBtnDisabled ? "bg-gray-500" : "bg-blue-500"} text-white px-4 py-2 rounded`} type="submit">
        Enviar
      </button>
      <div className="flex text-sm self-center ">
        <Link href="/" className={`text-blue-500 ml-2`}>
          Volver
        </Link>
      </div>
    </form>
  );
};

export default TimelineForm;
