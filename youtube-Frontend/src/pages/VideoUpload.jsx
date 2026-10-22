import { useForm } from "react-hook-form"
import { Plus } from "lucide-react"
import axios from "axios"
import { useRef } from "react"
import toast from "react-hot-toast"

const VideoUpload = () => {
  const { register, handleSubmit, formState: { errors }, } = useForm()
  const customInputRef = useRef(null)
  const thumnailInput = useRef()

  const {ref : registerRef} = register("video")

  async function Submit(data) {
    const formData = new FormData()
  }

  function clickInput(){
    if(customInputRef.current){
      customInputRef.current.click()
    }
  }
  

  return (
    <div className='w-full min-h-screen'>

      <form className="mx-auto w-[95%] max-w-180 border h-screen rounded-xl p-5 flex flex-col gap-y-5" onSubmit={handleSubmit(Submit)}>

        {/* Upper Video field Div */}
        <div className="videoField flex items-center justify-center w-full h-30 border border-dashed border-gray-400 rounded-[10px] relative transparent">

          {/* File upload input */}
          <input ref={(element)=>
            {
              registerRef(element);
              customInputRef.current = element
            }
          }
            {...register("video", {
              required: "Must upload video!",
              validate: (video) => video?.[0]?.type.startsWith("video/") || "Only Video File is allowed"
            })}
            className="w-full h-full outline-0 hidden" type="file" id="videofield" />
          {errors.video && toast.error(errors.video.message)}

          {/* Upload Button */}
          <button type="button"
            onClick={clickInput} className="flex items-center gap-x-2 py-3 px-7 border border-gray-400 rounded-[5px] cursor-pointer">
            <Plus color="#00a8ff" />
            <span className="font-medium text-[#00a8ff]">Upload</span>
          </button>

          {/* Progress Div */}
          <div className="progressDiv absolute -bottom-10 left-0">
            <p className={`progressBar rounded-[5px] w-full h-2.25 bg-blue-500`}></p>
            <span className="">10%</span>
          </div>

        </div> {/*Video Field Div end*/}


        {/* Title */}
        <div className="w-full h-13 border rounded-sm mt-10 focus-within:border-blue-500 duration-150">
          <input
            {...register("title", {
              required: "Title is required!",
              maxLength: {
                value: 300,
                message: "Title must be less then 300 characters"
              }
            })}
            className="w-full h-full outline-0 pl-4 "
            type="text" name="title" id="title" placeholder="Video Title" />
        </div>

        <div className="descriptionDiv w-full h-38 p-2 outline focus-within:outline-blue-500 rounded-xl duration-150">
          <textarea className="w-full h-full resize-none focus:outline-0" name="description" id="description" placeholder="Description..."></textarea>
        </div>

        {/*Thumbnail Field */}
        <div className="w-full">
          <label className="font-medium" htmlFor="thumnailInput">Thumnbail{" "} : {" "}
            <input
              {...register("thumbnail", {
                required: "Thumnail is required!",
                validate: (img) => img?.[0]?.type.startsWith("image/") || "Thmubnail must be an Image Type"
              })}
              ref={thumnailInput} className="border rounded-lg" type="file" name="thumnailInput" id="thumnailInput" />
          </label>
          {errors.thumbnail && toast.error(errors.thumbnail.message)}
        </div>
        {/* Thumbnail Field End*/}


      </form>

    </div>
  )
}

export default VideoUpload
