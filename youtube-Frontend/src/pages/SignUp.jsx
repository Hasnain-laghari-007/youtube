import logo from "../assets/youtube-logo-icon.jpg"
import { NavLink } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { api } from "../api/axios.js"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

const SignUp = () => {
    const navigate = useNavigate()
    const [showPass, setShowPass] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm()

    async function submit(data) {
        const formData = new FormData()
        formData.append("username", data.username)
        formData.append("password", data.password)
        formData.append("email", data.email)
        formData.append("fullName", data.fullName)
        formData.append("avatar", data.avatar[0])
        formData.append("coverImage", data.coverImage[0])
        try {
            await toast.promise(
                api.post("/users/register-user", formData),
                {
                    loading: "Registering...",
                    success: res => "Successfully Registered!",
                    error: (err) => err.response?.data?.message || "Registration failed",
                }
            );
            navigate("/login");
        } catch (error) { }
    }

    return (
        <div className='min-h-screen w-full flex justify-center items-center bg-[#0a0a0a] px-4 py-8'> {/* OUTER Main DIV */}

            <div className="signupDiv w-full max-w-md p-6 border border-gray-700 bg-[#111111] rounded-2xl shadow-[0_0_40px_rgba(62,166,255,0.2)] hover:shadow-[0_0_60px_rgba(62,166,255,0.4)] transition-shadow duration-300"> {/* Form Div*/}

                <div className="logo w-24 h-24 mx-auto mb-6"> {/* logo image */}
                    <img className="w-full h-full object-contain" src={logo} alt="Logo" />
                </div>

                <form className="flex flex-col gap-y-5" onSubmit={handleSubmit(submit)}>
                    <div className="inputRow group">
                        <input
                            {...register("fullName", {
                                required: "full name is Required!"
                            })}
                            type="text" placeholder="Full Name"
                            className="w-full h-12 pl-10 pr-4 border border-gray-600 rounded-lg bg-[#0a0a0a] text-white placeholder-gray-500 focus:border-[#3ea6ff] focus:ring-0.5 focus:ring-[#3ea6ff] focus:outline-none transition-all"
                        />
                        {errors?.fullName && <span className="text-[10px] text-red-500 mt-2">{errors?.fullName?.message}</span>}
                    </div>

                    <div className="inputRow relative group">
                        <input
                            {...register("email", {
                                required: "Email is required!",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
                                    message: "Invalid email!"
                                }
                            })}
                            type="email" placeholder="Email"
                            className="w-full h-12 pl-10 pr-4 border border-gray-600 rounded-lg bg-[#0a0a0a] text-white placeholder-gray-500 focus:border-[#3ea6ff] focus:ring-0.5 focus:ring-[#3ea6ff] focus:outline-none transition-all"
                        />
                        {errors?.email && <span className="text-[10px] text-red-500 mt-2">{errors?.email?.message}</span>}
                    </div>

                    <div className="inputRow">
                        <div className="relative w-full h-12">
                            <input
                                {...register("password", {
                                    required: "Password is required!",
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/,
                                        message: "Password must be 8+ characters with uppercase, lowercase, number and special character"
                                    }
                                })}
                                type={showPass ? "text" : "password"} placeholder="Password"
                                className="w-full h-full pl-10 pr-16 border border-gray-600 rounded-lg bg-[#0a0a0a] text-white placeholder-gray-500 focus:border-[#3ea6ff] focus:ring-0.5 focus:ring-[#3ea6ff] focus:outline-none transition-all"
                            />
                            <button type="button" onClick={() => setShowPass(prev => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs cursor-pointer text-gray-400 hover:text-white transition-colors">
                                {showPass ? "Hide" : "Show"}
                            </button>
                        </div>
                        {errors?.password && <span className="text-[10px] text-red-500 mt-2">{errors?.password?.message}</span>}
                    </div>

                    <div className="inputRow relative group">
                        <input
                            {...register("username", {
                                required: "Username is required!"
                            })}
                            type="text" placeholder="Username"
                            className="w-full h-12 pl-10 pr-4 border border-gray-600 rounded-lg bg-[#0a0a0a] text-white placeholder-gray-500 focus:border-[#3ea6ff] focus:ring-0.5 focus:ring-[#3ea6ff] focus:outline-none transition-all"
                        />
                        {errors?.username && <span className="text-[10px] text-red-500 mt-2">{errors?.username?.message}</span>}
                    </div>

                    <div className="flex flex-col gap-y-2">
                        <label className="text-sm text-gray-300 font-medium">Upload Avatar</label>
                        <input
                            {...register("avatar", {
                                required: "Avatar Image is required*",
                                validate: files => files[0]?.type.startsWith("image/") || "Only images are allowed"
                            })}
                            className="w-full h-10 pt-1.5 pl-2 border border-gray-600 rounded-lg bg-[#0a0a0a] text-gray-400 focus:border-[#3ea6ff] focus:ring-0.5 focus:ring-[#3ea6ff] cursor-pointer"
                            type="file" />
                        {errors?.avatar && <span className="text-[10px] text-red-500">{errors?.avatar?.message}</span>}
                    </div>

                    <div className="flex flex-col gap-y-2">
                        <label className="text-sm text-gray-300 font-medium">Upload Cover Image</label>
                        <input
                            {...register("coverImage", {
                                required: 'Cover Image is required',
                                validate: files => files[0]?.type.startsWith("image/") || "Only images are allowed"
                            })}
                            className="w-full h-10 border pt-1.5 pl-2 border-gray-600 rounded-lg bg-[#0a0a0a] text-gray-400 focus:border-[#3ea6ff] focus:ring-0.5 focus:ring-[#3ea6ff] cursor-pointer"
                            type="file" />
                        {errors?.coverImage && <span className="text-[10px] text-red-500">{errors?.coverImage?.message}</span>}
                    </div>


                    <p className="text-center text-[#aaaaaa] text-sm">Already have an account?{" "}
                        <NavLink className="text-[#3ea6ff] hover:underline hover:text-[#5bb4ff] transition-colors" to="/login">
                            Login
                        </NavLink>
                    </p>

                    <button disabled={isSubmitting} type="submit" className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 text-white font-medium transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer">
                        {isSubmitting ? <span className="flex items-center gap-2">Registering... <span className="animate-spin text-xs">⟳</span></span> : "Register"}
                    </button>
                    
                </form>

            </div>
        </div>
    )
}

export default SignUp