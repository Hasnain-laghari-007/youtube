import React from "react"

const VideoPreview = ({ videoSrc, videoPreview, setVideoPreview }) => {
  console.log(videoSrc)
  return (
    <div
      className={`fixed top-0 left-0 w-screen min-h-screen flex items-center justify-center bg-black/85 transition-opacity ${
        videoPreview ? "z-100 opacity-100 duration-150" : "opacity-0 duration-150 -z-100 pointer-events-none"
      }`}
    >
      <div className="relative border border-gray-500 rounded-lg w-145 h-80">
        <button
        type='button'
          onClick={() => setVideoPreview(false)}
          className="absolute -top-8 -right-9 w-11 h-11 rounded-[50%] flex items-center justify-center cursor-pointer"
        >
          <span className='text-4xl rotate-45 p-4 hover:scale-140 duration-150'>+</span>
        </button>
        {
          videoSrc && <video src={videoSrc} controls className='w-full h-full'></video>
        }
      </div>
    </div>
  )
}

export default React.memo(VideoPreview)