import TimeLine from '@/components/TimeLine'
import UserCard from '@/components/UserCard'
import dbConnect from '@/db/dbConnect'
import { TimeLineModel } from '@/db/models'
import { TimelineFormInputs } from '@/types'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { FunctionComponent } from 'react'

interface MyBoardProps {
  timelineData: TimelineFormInputs[];
}

const MyBoard: FunctionComponent<MyBoardProps> = ({ timelineData }) => {

  return (
    <>
      <div className="border flex justify-center items-center">
        <Link className="text-xs" href="/">Volver</Link>
        <h1 className="text-xl text-center font-bold m-4">Mis publicaciones</h1>
      </div>
      <UserCard
        imageSrc="https://randomuser.me/api/portraits/men/5.jpg"
        name="Juan Silva"
        description="Ciclista Amateur"
      />
      <div>
        {timelineData && timelineData.length > 0 && timelineData.map((e) => {
          return (
            <div key={e._id}>
              <TimeLine tags={e.tags} mainText={e.mainText} length={e.length} timeline={e.photo} createdAt={e.createdAt} />
            </div>
          )
        })}
      </div>
    </>
  );
};

export default MyBoard;

export const getServerSideProps: GetServerSideProps<MyBoardProps> = async () => {
  try {
    await dbConnect();

    const response = await TimeLineModel.find({}).sort({ createdAt: -1 }).limit(10).lean();

    const timelineData = response.map((item) => ({
      _id: item._id,
      mainText: item.mainText,
      length: item.length,
      photo: item.photo,
      createdAt: item.createdAt.toISOString(),
      tags: item.tags || []
    }));

    return {
      props: {
        timelineData,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        timelineData: [],
      },
    };
  }
};