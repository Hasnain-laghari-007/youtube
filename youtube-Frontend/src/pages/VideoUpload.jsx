import { useForm } from "react-hook-form"
import axios from "axios"

const VideoUpload = () => {
  const { register, handleSubmit, formState: { errors }, } = useForm()

  async function Submit(data) {
    const formData = new FormData()
  }

  return (
    <div className='w-full min-h-screen'>

      <form className="mx-auto w-[95%] max-w-180 border h-screen rounded-xl p-5" onSubmit={handleSubmit(Submit)}>

        <div className="videoField w-full h-30 border border-gray-400 rounded-[10px] relative transparent">
          <input className="w-full h-full outline-0" type="file" name="videofield" id="videofield" />

          

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
