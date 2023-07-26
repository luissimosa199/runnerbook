import TimeLine from '@/components/TimeLine';
import UserCard from '@/components/UserCard';
import dbConnect from '@/db/dbConnect';
import { TimeLineModel } from '@/db/models';
import { TimelineFormInputs } from '@/types';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { FunctionComponent } from 'react';

interface TimelinePageProps {
  timelineData: TimelineFormInputs | null;
}

const TimelinePage: FunctionComponent<TimelinePageProps> = ({ timelineData }) => {
  if (!timelineData) {
    return <div>Timeline not found</div>;
  }

  return (
    <>
      <div className="border flex justify-center items-center">
        <Link className="text-xs" href="/">Volver</Link>
        <h1 className="text-xl text-center font-bold m-4">Timeline</h1>
      </div>
      <UserCard
        imageSrc="https://randomuser.me/api/portraits/men/5.jpg"
        name="Juan Silva"
        description="Ciclista Amateur"
      />
      <div>
        <div key={timelineData._id}>
          <TimeLine _id={timelineData._id} tags={timelineData.tags} mainText={timelineData.mainText} length={timelineData.length} timeline={timelineData.photo} createdAt={timelineData.createdAt} />
        </div>
      </div>
    </>
  );
};

export default TimelinePage;

export const getServerSideProps: GetServerSideProps<TimelinePageProps> = async (context: GetServerSidePropsContext) => {
  try {
    await dbConnect();

    const { id } = context.query;

    const timeline = await TimeLineModel.findById(id).lean();

    if (!timeline) {
      return {
        notFound: true,
      };
    }

    const timelineData = {
      _id: timeline._id,
      mainText: timeline.mainText,
      length: timeline.length,
      photo: timeline.photo,
      createdAt: timeline.createdAt.toISOString(),
      tags: timeline.tags
    };

    return {
      props: {
        timelineData,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
};
