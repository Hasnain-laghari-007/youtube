import CardComponent from "../components/common/CardComponent.jsx"

const Home = () => {
  const videos = [{ id: Math.random() }, { id: Math.random() }, { id: Math.random() }, { id: Math.random() }]
  async function delay(){
    await fetch(setTimeout(()=>{},3000))
  }
  delay()
  return (
    <div className="h-full w-full p-10 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-x-4 gap-y-10">
      {
        videos.map((video)=>(
          <CardComponent key={video.id}/>
        ))
      }
    </div>
  )
}

export default Home