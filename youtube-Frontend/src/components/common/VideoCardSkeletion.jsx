const VideoCardSkeletion = () => {
    return (
        <div className="flex flex-col animate-pulse">
            <img className="bg-[#272727] thumbnailSkeletion aspect-video w-full rounded-xl" src={""} alt="thumbnail" />

            <div className="desc mt-3 flex">

                <div className="avatar w-9 h-9 rounded-[50%] bg-[#272727]">
                    <img className="w-full h-full" src="" alt="avatar" />
                </div>

                <div className="flex flex-col">
                    <p className="bg-[#272727] h-5 flex-1"></p>

                    <p className="bg-[#272727] h-5 flex-1/2"></p>
                </div>
            </div>
        </div>
    )
}

export default VideoCardSkeletion