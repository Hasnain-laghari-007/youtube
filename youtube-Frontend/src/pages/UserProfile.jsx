import React from 'react'
import { useLoaderData } from 'react-router-dom'
import { formatViews , timeAgo } from '../utils/DateViewFormat'

const UserProfile = () => {
    let { user } = useLoaderData()
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

                <div className="text-center sm:text-left ">
                    <h1 className="text-2xl md:text-4xl font-bold">{user?.fullName}</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        @{user?.username} • {user?.subscribers?.length || 0} subscribers
                    </p>
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
                            <div key={video._id} className="flex flex-col cursor-pointer">
                                <img className="aspect-video w-full object-cover rounded-xl" src={video.thumbnail} alt="thumbnail" />

                                <div className="desc mt-3 flex">

                                    <div className="descriptionDiv flex flex-col items-start flex-1">
                                        <p className="videoTitle text-[16px]/[22px] font-medium text-[#f1f1f1] line-clamp-2">
                                            {
                                                video.description || ""
                                            }
                                        </p>
                                        <p className="text-[14px] truncate font-normal text-[#aaaaaa] cursor-pointer">
                                            {formatViews(video.views)} • {timeAgo(video.createdAt)}
                                        </p>
                                    </div>

                                </div>

                            </div>
                        ))
                }
            </div>
        </div>
    );
}

export default UserProfile