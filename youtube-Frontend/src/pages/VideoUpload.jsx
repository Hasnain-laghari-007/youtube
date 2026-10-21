import { useForm } from "react-hook-form"
import {Plus} from "lucide-react"
import axios from "axios"
import { useRef } from "react"

const VideoUpload = () => {
  const { register, handleSubmit, formState: { errors }, } = useForm()
  const input = useRef()

  async function Submit(data) {
    const formData = new FormData()
  }

  return (
    <div className='w-full min-h-screen'>

      <form className="mx-auto w-[95%] max-w-180 border h-screen rounded-xl p-5" onSubmit={handleSubmit(Submit)}>

        <div className="videoField flex items-center justify-center w-full h-30 border border-dashed border-gray-400 rounded-[10px] relative transparent">
          <input ref={input} className="w-full h-full outline-0 hidden" type="file" name="videofield" id="videofield" />
          <button className="flex items-center gap-x-2 py-3 px-7 border border-gray-400 rounded-[5px] cursor-pointer">
            <Plus color="#00a8ff"/>
            <span className="font-medium text-[#00a8ff]">Upload</span>
          </button>
          <div className="progressDiv absolute -bottom-10 left-0">
            <p className={`progressBar rounded-[5px] w-full h-2.25 bg-blue-500`}></p>
            <span className="">10%</span>
          </div>

        </div>

      </form>

    </div>
  )
}

export default VideoUpload
