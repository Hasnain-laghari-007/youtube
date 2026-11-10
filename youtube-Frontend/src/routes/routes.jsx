import { createBrowserRouter, Outlet } from "react-router-dom";
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
                element: <Login />
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
                    let userVideos = [], currentUser = {};
                    async function fetchUserVideos() {
                        try {
                            const response = await api.get("/videos/get-current-user-videos")
                            userVideos = response.data.data
                        } catch (error) {
                            if(error.response?.data?.statusCode !== 401){
                                toast.error("Error occur while fetching videos!")
                            }
                        }
                    }

                    async function fetchCurrentUser() {
                        try {
                            const response = await api.get("/users/current-user")
                            currentUser = response.data.data
                        } catch (error) {
                            if (error.response?.data?.statusCode !== 401) {
                                toast.error(error.response?.data?.message || "Error occur while fetching user data!")
                            }
                        }
                    }
                    await Promise.all([fetchCurrentUser(), fetchUserVideos()])
                    return { userVideos, currentUser }
                }
            }
        ]
    }
])

export { router }