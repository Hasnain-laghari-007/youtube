import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layout/Layout.jsx";
import Home from "../pages/Home.jsx";

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
    }
])

export {router}