import React from 'react'
import { useLoaderData } from 'react-router-dom'

// YouTube dark mode colors:
// page bg      #0f0f0f
// main text    #f1f1f1
// grey text    #aaaaaa
// buttons      #272727 (hover #3f3f3f)
// dividers     #3f3f3f

const WatchPage = () => {
  let { video } = useLoaderData()
  console.log("Watch Page Data : ",video)

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#f1f1f1]">
      <div className="mx-auto flex max-w-[1750px] flex-col gap-6 px-4 py-6 lg:flex-row lg:px-6">
        {/* ---------- Left: player + info + comments ---------- */}
        <div className="min-w-0 flex-1">
          {/* Player (16:9) */}
          <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
            <video
              src={video?.videoFile}
              poster={video?.thumbnail}
              controls
              autoPlay
              className="h-full w-full"
            />
          </div>

          {/* Title */}
          <h1 className="mt-3 text-xl font-semibold leading-7">
            {video?.title}
          </h1>

          {/* Channel row + actions */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={video?.owner?.avatar || 'https://via.placeholder.com/40'}
                alt=""
                className="h-10 w-10 rounded-full object-cover"
              />
              <div className="leading-tight">
                <p className="text-base font-medium">
                  {video?.owner?.username || 'Channel name'}
                </p>
                <p className="text-xs text-[#aaaaaa]">
                  {video?.owner?.subscribers ?? 0} subscribers
                </p>
              </div>
              {/* Subscribe button */}
              <button className="ml-3 rounded-full bg-[#f1f1f1] px-4 py-2 text-sm font-medium text-[#0f0f0f] hover:bg-[#d9d9d9]">
                Subscribe
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Like / Dislike pill */}
              <div className="flex overflow-hidden rounded-full bg-[#272727]">
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium hover:bg-[#3f3f3f]">
                  👍 {video?.likes ?? 0}
                </button>
                <span className="my-2 w-px bg-[#3f3f3f]" />
              </div>
              <button className="rounded-full bg-[#272727] px-4 py-2 text-sm font-medium hover:bg-[#3f3f3f]">
                Share
              </button>
              <button className="rounded-full bg-[#272727] px-4 py-2 text-sm font-medium hover:bg-[#3f3f3f]">
                Save
              </button>
            </div>
          </div>

          {/* Description box */}
          <div className="mt-4 cursor-pointer rounded-xl bg-[#272727] p-3 text-sm hover:bg-[#3f3f3f]">
            <p className="font-medium">
              {video?.views ?? 0} views
              <span className="ml-2">
                {video?.createdAt &&
                  new Date(video.createdAt).toLocaleDateString()}
              </span>
            </p>
            <p className="mt-1 line-clamp-3 whitespace-pre-line">
              {video?.description}
            </p>
          </div>

          {/* Comments */}
          <section className="mt-6">
            <h2 className="text-xl font-semibold">
              {video?.comments ?? 0} Comments
            </h2>

            <div className="mt-5 flex gap-3">
              <div className="h-10 w-10 shrink-0 rounded-full bg-[#3f3f3f]" />
              <input
                type="text"
                placeholder="Add a comment..."
                className="w-full border-b border-[#717171] bg-transparent pb-1 text-sm text-[#f1f1f1] outline-none placeholder:text-[#aaaaaa] focus:border-white"
              />
            </div>

            <div className="mt-6 space-y-5">
              {(video?.comments || []).map((c) => (
                <div key={c._id} className="flex gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-[#3f3f3f]" />
                  <div>
                    <p className="text-[13px] font-medium">{c.owner?.username}</p>
                    <p className="text-sm">{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ---------- Right: suggested videos ---------- */}
        <aside className="w-full shrink-0 lg:w-100.5">
          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex cursor-pointer gap-2">
                <div className="aspect-video w-42 shrink-0 rounded-lg bg-[#272727]" />
                <div className="min-w-0">
                  <p className="line-clamp-2 text-sm font-medium leading-5">
                    Suggested video title {i}
                  </p>
                  <p className="mt-1 text-xs text-[#aaaaaa]">Channel name</p>
                  <p className="text-xs text-[#aaaaaa]">1K views</p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}

export default WatchPage