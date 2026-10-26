import { useForm } from "react-hook-form"
import { Plus } from "lucide-react"
import { api } from "../api/axios.js"
import { useRef, useState } from "react"
import toast from "react-hot-toast"

const VideoUpload = () => {
  const { register, handleSubmit, formState: { errors }, } = useForm()
  const customInputRef = useRef(null)
  const thumnailInput = useRef()
  const [progress, setProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState("idle")
  const [uploadedVideo, setUploadedVideo] = useState(null)

  const { ref: registerRef, ...videoRest } = register("video", {
    required: "Must upload video!",
    validate: (video) =>
      video?.[0]?.type.startsWith("video/") || "Only Video File is allowed",
  })

  async function Submit(data) {
    const formData = new FormData()

  }
  function onErrors(errors) {
    const firstError = Object.values(errors)[0]
    toast.error(firstError.message)
  }

  async function handleChange(e) {
    const file = e.target.files[0]
    videoRest.onChange(e)
    if (!file) return
    if (!file.type.startsWith("video/")) { toast.error("File must be a video!"); return }
    setProgress(0)
    setUploadStatus("uploading")

    const formData = new FormData()
    formData.append("Video", file)

    try {
      const response = await api.post("/upload-video", formData,
        {
          onUploadProgress: (event) => {
            if (!event.total) return
            setProgress(Math.round((event.loaded * 100) / event.total))
          }
        })
        setUploadedVideo(response.data.data)
        setUploadStatus("success")
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
      setProgress(0)
      setUploadStatus("idle")
    }
  }

  function clickInput() {
    if (customInputRef.current) {
      customInputRef.current.click()
    }
  }


  return (
    <div className='w-full'>

      <form  className="videoForm mx-auto w-[95%] max-w-160 border  rounded-xl p-5 flex flex-col gap-y-4" onSubmit={handleSubmit(Submit, onErrors)}>

        {/* Upper Video field Div */}
        <div className="videoField flex items-center justify-center w-full h-30 border border-dashed border-gray-400 rounded-[10px] relative transparent">

          {/* File upload input */}
          <input
            {...videoRest}
            ref={(element) => {
              registerRef(element);
              customInputRef.current = element
            }
            }
            onChange={handleChange}
            className="w-full h-full outline-0 hidden" type="file" id="videofield" />

          {/* Upload Button */}
          <button type="button"
            onClick={clickInput} className="flex items-center gap-x-2 py-3 px-7 border border-gray-400 hover:bg-gray-900 duration-150  rounded-[5px] cursor-pointer">
            <Plus className="w-[clamp(0.98rem,3vw,1.25rem)] h-[clamp(0.98rem,3vw,1.25rem)]" color="#00a8ff" />
            <span className="font-medium text-[#00a8ff]">Upload</span>
          </button>

          {/* Progress Div */}
          {uploadStatus !== "idle" && <div className="progressDiv absolute -bottom-10 left-0">
            <progress className="" value={progress} max={100}>{progress}%</progress>
          </div>}

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
        <div className="w-full flex flex-wrap gap-y-3 gap-x-3 items-center">
          <label className="font-medium" htmlFor="thumnailInput">Thumnbail{" "} : {" "}
            <input
              {...register("thumbnail", {
                required: "Thumnail is required!",
                validate: (img) => img?.[0]?.type.startsWith("image/") || "Thmubnail must be an Image Type"
              })}
              ref={thumnailInput} className="border rounded-lg py-2 cursor-pointer max-[375px]:w-full" type="file" name="thumnailInput" id="thumnailInput" />
          </label>
          <button type="button" className="preview border border-gray-500 rounded-[7px] bg-[#333333] font-medium py-2 px-7 hover:bg-gray-600 duration-150 cursor-pointer">
            Preview
          </button>
        </div>
        {/* Thumbnail Field End*/}

        {/*Lower div*/}

        <div className="w-full flex items-center justify-between my-3">


          <button className="bg-red-500 hover:bg-red-600 duration-150 py-2 px-8 rounded-lg font-medium cursor-pointer"> {/* Cancel Button */}
            Cancel
          </button>

          <button className="bg-green-500 hover:bg-green-600 active:bg-green-700 duration-150 py-2 px-8 rounded-lg font-medium cursor-pointer"> {/* Submit Button */}
            Submit
          </button>
        </div>

        {/*Lower div end*/}

      </form>

    </div>
  )
}

export default VideoUpload
