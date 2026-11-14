import { Play } from "lucide-react"
import { formatViews, timeAgo } from "../../utils/DateViewFormat"

const VideoCard = ({ video }) => {
    return (
        <div className="videoCard flex flex-col">
            <img className="aspect-video w-full object-cover rounded-xl" src={video?.thumbnail} alt="thumbnail" />

            <div className="desc mt-3 flex gap-x-1">
                {/* Avatar */}
                <div className="avatar w-9 h-9 rounded-[50%]">
                    <img className="w-full h-full" src={video?.avatar} alt="avatar" />
                </div>

                {/* video Info Div */}
                <div className="descriptionDiv flex flex-col items-start flex-1 space-y-0.2">

                    {/* Description */}
                    <p className="videoTitle text-[16px]/[22px] font-medium text-[#f1f1f1] line-clamp-2">
                        {video?.description}
                    </p>

                    <div className="flex items-center gap-x-2">
                        <button type="button" className="channel text-[14px] truncate font-normal text-[#aaaaaa] hover:text-white cursor-pointer">
                            {video?.username}
                        </button>

                    
                        <div className="viewSpan flex items-center text-[#aaaaaa]">
                            <div className="playSpan flex items-center gap-x-2 mx-2">

                                <Play size={16} color="#aaaaaa" />
                                <span>{formatViews(video?.views)}</span> {/* views */}
                            </div>

                            {/* Uploade time */}
                            <span className="mx-2">{timeAgo(video?.createdAt)}</span>
                            
                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
}

export default VideoCard




