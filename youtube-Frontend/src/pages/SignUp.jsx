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
                    success: res => `Welcome ${res.data?.data?.username}`,
                    error: (err) => err.response?.data?.message || "Registration failed",
                }
            );
            navigate("/login");
        } catch (error) {}
    }

    return (
        <div className='min-h-screen w-full flex justify-center items-center overflow-y-hidden'> {/* OUTER Main DIV */}

            <div className="signupDiv w-full max-w-100 border p-4 flex flex-col items-center bg-[#111111] border-gray-500 rounded-lg shadow-[0_0_25px_rgba(62,166,255,0.15)] hover:shadow-[0_0_35px_rgba(62,166,255,0.3)] transition-shadow duration-300"> {/* Form Div*/}

                <div className="logo w-30"> {/* logo image */}
                    <img className="object-fill" src={logo} alt="Logo" />
                </div>

                <form className="flex flex-col w-full h-full px-2 gap-y-6" onSubmit={handleSubmit(submit)}>
                    <div className="inputRow">
                        <input
                            {...register("fullName", {
                                required: "full name is Required!"
                            })}
                            type="text" placeholder="Full Name" />
                        {errors?.fullName && <span>{errors?.fullName?.message}</span>}
                    </div>

                    <div className="inputRow">
                        <input
                            {...register("email", {
                                required: "Email is required!",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
                                    message: "Invalid email!"
                                }
                            })}
                            type="email" placeholder="Email" />
                        {errors?.email && <span>{errors?.email?.message}</span>}
                    </div>

                    <div className="inputRow">
                        <input
                            {...register("password", {
                                required: "Password is required!",
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/,
                                    message: "Password must be 8+ characters with uppercase, lowercase, number and special character"
                                }
                            })}
                            type={showPass ? "text" : "password"} placeholder="Password" />
                        <button type="button" onClick={() => setShowPass(prev => !prev)} className="absolute top-0 right-0 h-full px-5 border bg-gray-900 hover:bg-gray-800 duration-150 cursor-pointer">
                            {
                                showPass ? "Hide" : "Show"
                            }
                        </button>
                        {errors?.password && <span className="text-nowrap text-[8px]">{errors?.password?.message}</span>}
                    </div>

                    <div className="inputRow">
                        <input
                            {...register("username", {
                                required: "Username is required!"
                            })}
                            type="text" placeholder="Username" />
                        {errors?.username && <span>{errors?.username?.message}</span>}
                    </div>

                    <div className="flex items-center gap-x-2">
                        <span className="required text-[13px]">Upload Avatar</span>
                        <input
                            {...register("avatar", {
                                required: "Avatar Image is required*",
                                validate: files => files[0]?.type.startsWith("image/") || "Only images are allowed"
                            })}
                            className="border rounded-lg flex-1" type="file" />
                        {errors?.avatar && <span className="text-[10px] text-red-500">{errors?.avatar?.message}</span>}
                    </div>

                    <div className="flex items-center gap-x-2">
                        <span className="required text-[13px]">Upload cover image</span>
                        <input
                            {...register("coverImage", {
                                required: "Cover Image is required*",
                                validate: files => files[0]?.type.startsWith("image/") || "Only images are allowed"
                            })}
                            className="border rounded-lg flex-1" type="file" />
                        {errors?.coverImage && <span className="text-[10px] text-red-500">{errors?.coverImage?.message}</span>}
                    </div>


                    <p className="text-[#aaaaaa]">Already have an account?{" "}
                        <NavLink className={"cursor-pointer hover:underline text-[#3ea6ff]"} to="/login">
                            Login
                        </NavLink>
                    </p>

                    <button disabled={isSubmitting} type="submit" className={`bg-blue-700 hover:bg-blue-500 duration-150 cursor-pointer mx-auto py-2 px-10 rounded-lg disabled:cursor-not-allowed disabled:opacity-50`}>
                        {
                            isSubmitting ? "Registering..." : "Register"
                        }
                    </button>
                </form>

            </div>
        </div>
    )
}

export default SignUp