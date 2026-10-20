import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layout/Layout.jsx";
import Home from "../pages/Home.jsx";
import SignUp from "../pages/SignUp.jsx";
import Login from "../pages/Login.jsx";
import VideoUpload from "../pages/VideoUpload.jsx";

const router = createBrowserRouter([
    {
        path : "/",
        element : <Layout/>,
        children : [
            {
                path : "/",
                element : <Home/>
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
    }
])

export {router}