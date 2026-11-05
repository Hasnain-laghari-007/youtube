export function formatViews(count = 0) {
  const short = new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(count)
  return `${short} ${count === 1 ? "view" : "views"}`
}


export function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000)

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ]

  for (const { label, seconds: s } of intervals) {
    const value = Math.floor(seconds / s)
    if (value >= 1) return `${value} ${label}${value > 1 ? "s" : ""} ago`
  }
  return "Just now"
}
