import {useState} from "react"
import VideoCard from "../components/common/VideoCard.jsx"
import VideoCardSkeletion from "../components/common/VideoCardSkeletion.jsx"

const Home = () => {
  const [loading,setLoading] = useState(true)
  const videos = [{ id: Math.random() }, { id: Math.random() }, { id: Math.random() }, { id: Math.random() },{ id: Math.random() },{ id: Math.random() }]

  setTimeout(()=>{setLoading(false)},3000)
  
  return (
    <div className="h-full w-full overflow-x-hidden overflow-y-auto p-10 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-x-4 gap-y-10">
      {loading ? 
        videos.map((video)=>(
          <VideoCardSkeletion key={video.id}/>
        ))
        :
        videos.map((video)=>(
          <VideoCard key={video.id}/>
        ))
      }
    </div>
  )
}

export default Home