import VideoCard from "../components/common/VideoCard.jsx"
import VideoCardSkeletion from "../components/common/VideoCardSkeletion.jsx"
import { useLoaderData } from "react-router-dom"

const Home = () => {
  const { videos } = useLoaderData()

  return (
    <div className="h-full w-full overflow-x-hidden overflow-y-auto p-10 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-x-4 gap-y-10">
      { !videos ? 
        new Array(6).map((_,idx) => (
          <VideoCardSkeletion key={idx}/>
        ))
        :
        videos.map((video) => (
          <VideoCard key={video?._id} video = {video} />
        ))
      }
    </div>
  )
}

export default Home