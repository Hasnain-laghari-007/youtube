import { createBrowserRouter, Outlet } from "react-router-dom";
import Layout from "../components/layout/Layout.jsx";
import Home from "../pages/Home.jsx";
import SignUp from "../pages/SignUp.jsx";
import Login from "../pages/Login.jsx";
import VideoUpload from "../pages/VideoUpload.jsx";
import Profile from "../pages/Profile.jsx"
import ApiLoader from "../components/common/ApiLoader.jsx"

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
        element : <RootLayout/>,
        children : [
            {
                path : "/",
                element : <Layout/>,
                children : [
                    {
                        path : "/",
                        element : <Home/>,
                        loader : async ()=>{
                            await new Promise(resolve => setTimeout(resolve,2000))
                            return null
                        }
                    }
                ]
            },
            {
                path : "/login",
                element : <Login/>
            },
            {
                path : "/signup",
                element : <SignUp/>
            },
            {
                path : "/upload-video",
                element : <VideoUpload/>
            },
            {
                path : "/profile",
                element : <Profile/>,
                loader : async ()=>{
                    await new Promise(resolve => setTimeout(resolve,2000))
                }
            }
        ]
    }
])

export {router}