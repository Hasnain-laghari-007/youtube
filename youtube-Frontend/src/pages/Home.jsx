const Home = () => {
  const videos = [1,2,3,4,5,6]
  return (
    <div className="h-full w-full p-10 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
      {
        videos.map((box) => (
          <div key={box} className="border rounded-xl"></div>
        ))
      }
    </div>
  )
}

export default Home