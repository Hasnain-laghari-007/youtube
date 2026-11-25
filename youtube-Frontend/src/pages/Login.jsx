import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { api } from "../api/axios.js"
import { useNavigate, useSearchParams } from "react-router-dom"
import toast from "react-hot-toast"
import { NavLink } from "react-router-dom"
import { useAuthStore } from "../store/useAuthStore.js"

const Login = () => {
  const [showPass, setShowPass] = useState(false)
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get("redirect")
  const navigate = useNavigate()
  const setUser = useAuthStore(s => s.setUser)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()


  async function login(data) {
    const val = data.username_Email
    const password = data.password
    try {
      await toast.promise(
        api.post("/users/login", {
          UsernameOrEmail: val,
          password: password
        }),
        {
          loading: 'Logging in...',
          success: res => `Welcome back, ${res.data?.data?.username || ""}`,
          error: err => err.response?.data?.message,
        }
      );
      const user = await api.get("/users/current-user")
      setUser(user.data?.data)
      if (redirect && redirect.startsWith("/") && !redirect.startsWith("//")) {
        navigate(redirect)
        return
      }
      navigate("/")
    } catch (error) { }
  }

  useEffect(() => {
    toast('Please login!', {
      duration: 3000,
      className: '!bg-gray-900 !text-white border border-gray-500',
      id: "myToast"
    });
  }, [])


  return (
    <div className='min-h-screen w-full flex justify-center items-center bg-[#0a0a0a] px-4 py-8'>
      <div className="loginDiv w-full max-w-md p-6 border border-gray-700 bg-[#111111] rounded-2xl shadow-[0_0_40px_rgba(62,166,255,0.2)] hover:shadow-[0_0_60px_rgba(62,166,255,0.4)] transition-shadow duration-300">

        <form className="flex flex-col gap-y-5" onSubmit={handleSubmit(login)}>

          <div className="inputRow relative group">

            <input
              {...register("username_Email", {
                required: "Username or Email is required!",
              })}
              placeholder="Username or Email"
              type="text"
              className="w-full h-12 pl-10 pr-4 border border-gray-600 rounded-lg bg-[#0a0a0a] text-white placeholder-gray-500 focus:border-[#3ea6ff] focus:ring-0.5 focus:ring-[#3ea6ff] focus:outline-none transition-all"
            />
            
            {errors.username_Email && <span className="text-[10px] text-red-500 ">{errors.username_Email.message}</span>}

          </div>

          <div className="inputRow">

            <div className="relative w-full h-12">

              <input
                {...register("password", {
                  required: "Password is required!",
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/,
                    message: "Must contain 8+ characters, numbers, special letters "
                  }
                })}
                type={showPass ? "text" : "password"} placeholder="Password"
                className="w-full h-full pl-10 pr-16 border border-gray-600 rounded-lg bg-[#0a0a0a] text-white placeholder-gray-500 focus:border-[#3ea6ff] focus:ring-0.5 focus:ring-[#3ea6ff] focus:outline-none transition-all"
              />

              <button type="button" onClick={() => setShowPass(prev => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white transition-colors cursor-pointer">
                {showPass ? "Hide" : "Show"}
              </button>

            </div>

            {errors?.password && <span className="text-[10px] text-red-500 my-2">{errors?.password?.message}</span>}

          </div>

          <p className="text-center text-[#aaaaaa] text-sm">Don't have an account?{" "}
            <NavLink className="text-[#3ea6ff] hover:underline hover:text-[#5bb4ff] transition-colors" to="/signup">
              Signup
            </NavLink>
          </p>

          <button disabled={isSubmitting} type="submit" className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 text-white font-medium transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer">
            Login
          </button>

        </form>
      </div>
    </div>
  )
}

export default Login

// .loginDiv .inputRow