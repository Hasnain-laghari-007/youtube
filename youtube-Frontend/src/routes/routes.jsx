import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layout/Layout.jsx";
import Home from "../pages/Home.jsx";
import SignUp from "../pages/SignUp.jsx";
import Login from "../pages/Login.jsx";

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
    }
])

export {router}