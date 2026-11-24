import React, { useState } from 'react'
import { useLoaderData, Link, useNavigate, useLocation } from 'react-router-dom'
import { formatViews, timeAgo } from '../utils/DateViewFormat.js'
import { Play } from 'lucide-react'
import { api } from "../api/axios.js"
import toast from "react-hot-toast"
import { useAuthStore } from '../store/useAuthStore.js'

const UserProfile = () => {
    let { user } = useLoaderData()
    const navigate = useNavigate()
    const location = useLocation()
    const [subscribed, setSubscribed] = useState(user?.isSubscribed)
    const [subscribers,setSubscribers] = useState(user?.subscribers || 0)
    const [subscribePro, setSubscribePro] = useState(false)
    const [blocked, setBlocked] = useState(false)
    const isAuthLoading = useAuthStore(s => s.isAuthLoading)
    const isUser = useAuthStore(s => s.user)

    async function handleClick() {
        if (isAuthLoading) return
        if (isUser === null) {
            navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`)
            return
        }

        const prev = subscribed
        const prevSubscribers = subscribers
        if(prev === false){
            setSubscribers(prevSubscribers + 1)
        }
        else setSubscribers(prevSubscribers - 1)
        setSubscribePro(true)

        try {
            let res = await api.post(`/subscription/toggle/v/${user?._id}`)
            setSubscribed(res.data?.data?.subscribe)
            toast.success(res.data?.message)
        } catch (error) {
            setSubscribed(prev) // show previous state of subscribe
            setSubscribers(prevSubscribers)
            if (error.response?.status === 429) {
                setBlocked(true)
                toast.error("Too many attempts. Try again after 1 minutes.", { id: "too-many-subscribe-requests" })
                setTimeout(() => setBlocked(false), 60 * 1000)
            } else {
                toast.error(error.response?.data?.message || "Something went wrong!", { id: "subscribe-error" })
            }
        }
        finally {
            setSubscribePro(false)
        }
    }

    return (
        <div className="max-w-321 mx-auto px-4 pb-7 md:px-6">

            {/* Cover image */}
            <div className="w-full aspect-[6.2/1] min-h-25 md:rounded-xl overflow-hidden bg-gray-700 flex items-center justify-center">
                {user?.coverImage &&
                    <img
                        src={user.coverImage}
                        alt="cover image"
                        className="w-full h-full object-cover"
                    />
                }
            </div>

            {/* Profile info */}

            <div className=" flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mt-4">
                {/* Profile image */}

                <div className="relative w-20 h-20 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-gray-700 shrink-0 flex items-center justify-center">
                    {user?.avatar &&
                        <img
                            src={user.avatar}
                            alt="avatar"
                            className="w-full h-full object-cover"
                        />
                    }
                </div>

                <div className="text-center sm:text-left">
                    <h1 className="text-2xl md:text-4xl font-bold">{user?.fullName}</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        @{user?.username} • {subscribers} subscribers
                    </p>

                    <button
                        type="button"
                        disabled={subscribePro || blocked}
                        onClick={handleClick}
                        className={`ml-3 my-2.5 inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full px-6 py-2 text-sm font-medium transition-colors duration-150 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${subscribed
                            ? "bg-[#272727] text-[#f1f1f1] hover:bg-[#3f3f3f]"
                            : "bg-[#f1f1f1] text-[#0f0f0f] hover:bg-[#d9d9d9]"
                            }`}
                    >
                        {subscribed ? "Subscribed" : "Subscribe"}
                    </button>

                </div>

            </div>

            {/* Videos grid */}
            <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 mt-8">
                {
                    !user.videos?.length ?
                        <div className="absolute flex justify-center w-full">
                            <p className="text-center text-3xl">No videos!</p>
                        </div>
                        :
                        user.videos.map((video) => (
                            <Link to={`/watch/${video._id}`} key={video._id} className="flex flex-col cursor-pointer">
                                <img className="aspect-video w-full object-cover rounded-xl" src={video.thumbnail} alt="thumbnail" />

                                <div className="desc mt-3 flex">

                                    <div className="descriptionDiv flex flex-col items-start flex-1">
                                        <p className="videoTitle text-[16px]/[22px] font-medium text-[#f1f1f1] line-clamp-2">
                                            {
                                                video.description || ""
                                            }
                                        </p>
                                        <p className="text-[13px] flex items-center truncate font-normal text-[#aaaaaa] cursor-pointer">
                                            <Play size={14} /> <span className="ml-1.5 mr-2">{formatViews(video.views)} </span>
                                            <span> {timeAgo(video.createdAt)}</span>
                                        </p>
                                    </div>

                                </div>

                            </Link>
                        ))
                }
            </div>
        </div>
    );
}

export default UserProfile