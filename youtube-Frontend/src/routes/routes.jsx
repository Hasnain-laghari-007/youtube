import { createBrowserRouter, Outlet, redirect } from "react-router-dom";
import Layout from "../components/layout/Layout.jsx";
import Home from "../pages/Home.jsx";
import SignUp from "../pages/SignUp.jsx";
import Login from "../pages/Login.jsx";
import VideoUpload from "../pages/VideoUpload.jsx";
import Profile from "../pages/Profile.jsx"
import ApiLoader from "../components/common/ApiLoader.jsx"
import { api } from "../api/axios.js";
import toast from "react-hot-toast";

const RootLayout = () => {
    return (
        <>
            <ApiLoader />
            <Outlet />
        </>
    )
}

const router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            {
                path: "/",
                element: <Layout />,
                children: [
                    {
                        path: "/",
                        element: <Home />,
                        loader: async () => {
                            await new Promise(resolve => setTimeout(resolve, 2000))
                            return null
                        }
                    }
                ]
            },
            {
                path: "/login",
                element: <Login />,
                loader: async () => {
                    try {
                        await api.get("/users/current-user")
                        return redirect("/")
                    } catch {
                        return null
                    }
                }
            },
            {
                path: "/signup",
                element: <SignUp />
            },
            {
                path: "/upload-video",
                element: <VideoUpload />
            },
            {
                path: "/profile",
                element: <Profile />,
                loader: async () => {
                    try {
                        const [Data, Videos] = await Promise.all([api.get("/users/current-user"), api.get("/videos/get-current-user-videos")])

                        return { currentUser: Data.data?.data, userVideos: Videos.data.data }

                    } catch (error) {
                        if (error.response?.status === 401) {
                            return redirect("/login")
                        }
                        toast.error(error.response?.data?.message || "Something went wrong!");
                        return { currentUser: null, userVideos: [] };
                    }
                }
            }
        ]
    }
])

export { router }