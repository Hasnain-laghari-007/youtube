import { useState } from "react"
import { useForm } from "react-hook-form"
import { api } from "../api/axios.js"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

const Login = () => {
  const [showPass, setShowPass] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors,isSubmitting },
  } = useForm()
  const navigate = useNavigate()

  async function login(data) {
    const val = data.username_Email
    const isEmail = data.username_Email.includes("@")
    const password = data.password
    try {
      await toast.promise(
        api.post("/users/login", {
          [isEmail ? "email" : "username"] : val,
          password : password
         }),
        {
          loading: 'Logging in...',
          success: res => `Welcome back, ${res.data?.data?.username || ""}`,
          error: err => err.response?.data?.message,
        }
      );
      navigate("/")
    } catch (error) { }
  }

  return (
    <div className='w-screen h-screen flex justify-center items-center bg-[#0f0f0f]'>
      <div className="loginDiv w-[90%] max-w-100 mx-auto p-5 rounded-lg bg-[#212121]">

        <form className="flex flex-col gap-y-8" onSubmit={handleSubmit(login)}>

          <div className="inputRow">
            <input
              {...register("username_Email", {
                required: "Username or Email is required!",
              })}
              placeholder="Username or Email"
              type="text" />
            {errors.username_Email && <span className="text-red-500 text-[10px]">{errors.username_Email.message}</span>}
          </div>

          <div className="inputRow">
            <input
              {...register("password", {
                required: "Password is required!",
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/,
                  message: "Must contain 8+ characters, numbers, special letters "
                }
              })}
              type={showPass ? "text" : "password"} placeholder="Password" />
            <button type="button" onClick={() => setShowPass(prev => !prev)} className="absolute top-0 right-0 h-full px-5 border bg-gray-900 hover:bg-gray-800 duration-150 cursor-pointer">
              {
                showPass ? "Hide" : "Show"
              }
            </button>
            {errors?.password && <span className="mt-5 text-[10px]">{errors?.password?.message}</span>}
          </div>

          <button disabled={isSubmitting} type="submit" className="mx-auto my-3 py-2 font-medium rounded-md cursor-pointer hover:bg-blue-700 duration-150 px-10 bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50">
              Login
          </button>

        </form>
      </div>
    </div>
  )
}

export default Login

// .loginDiv .inputRow