import { createBrowserRouter, Outlet, redirect } from "react-router-dom";
import Layout from "../components/layout/Layout.jsx";
import Home from "../pages/Home.jsx";
import SignUp from "../pages/SignUp.jsx";
import UserProfile from "../pages/UserProfile.jsx";
import Login from "../pages/Login.jsx";
import VideoUpload from "../pages/VideoUpload.jsx";
import Profile from "../pages/Profile.jsx"
import ApiLoader from "../components/common/ApiLoader.jsx"
import { api } from "../api/axios.js";
import toast from "react-hot-toast";
import WatchPage from "../pages/WatchPage.jsx";

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
                            try {
                                const response = await api.get("/videos/videoPage")
                                return {videos : response.data.data.docs}
                            } catch (error) {
                                toast.error( error.response?.data?.message || "Something went wrong!")
                                return {videos : []}
                            }
                        }
                    }
                ]
            },
            // login Page Route
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
            // Sign up Page Route
            {
                path: "/signup",
                element: <SignUp />
            },
            // Video Upload Page Route
            {
                path: "/upload-video",
                element: <VideoUpload />
            },
            // My Profile Profile Page Route
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
            },
            // User Profile Page Route
            {
                path : "/user/:username",
                element : <UserProfile/>,
                loader : async({params})=>{
                    try {
                        const res = await api.get(`/users/channel/${params.username}`)
                        return {user : res.data.data}
                    } catch (error) {
                        toast.error( error.response?.data?.message || "Something went wrong!")
                        return {user  : {} }
                    }
                }
            },
            // Watch Page Route
            {
                path : "/watch/:id",
                element : <WatchPage/>,
                loader : async({params})=>{
                    try {
                        let response = await api.get(`/videos/video/${params.id}`)
                        return {video : response.data?.data}
                    } catch (error) {
                        toast.error(error.response?.data?.message || "Something went wrong!")
                        return {video : {}}
                    }
                }
            }
        ]
    }
])

export { router }