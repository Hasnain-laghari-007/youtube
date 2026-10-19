const VideoCardSkeletion = () => {
    return (
        <div className="skeletion flex flex-col">
            <div className="bg-[#272727] thumbnailSkeletion aspect-video w-full rounded-xl"></div>

            <div className="desc mt-3 flex space-x-2">

                <div className="avatar w-11 h-10 rounded-[50%] bg-[#272727]"></div>

                <div className="flex flex-col gap-y-3 w-full">
                    <p className="bg-[#272727] rounded-sm h-5 w-full"></p>
                    <p className="bg-[#272727] rounded-sm h-5 w-[50%]"></p>
                </div>
            </div>
        </div>
    )
}

export default VideoCardSkeletion