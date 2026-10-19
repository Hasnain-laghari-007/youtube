import VideoCard from "../components/common/VideoCard.jsx"

const Home = () => {
  const videos = [{ id: Math.random() }, { id: Math.random() }, { id: Math.random() }, { id: Math.random() }]
  async function delay(){
    await fetch(setTimeout(()=>{},3000))
  }
  delay()
  return (
    <div className="h-full w-full overflow-x-hidden overflow-y-auto p-10 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-x-4 gap-y-10">
      {
        videos.map((video)=>(
          <VideoCard key={video.id}/>
        ))
      }
    </div>
  )
}

export default Home