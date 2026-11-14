export function formatViews(count = 0) {
  const short = new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(count)
  if(short < 1000){
    return `${short}`
  }
  if(short >= 1000000){
    return `${short}M`
  }
  return `${short}k`
}


export function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000)

  const intervals = [
    { label: "y", seconds: 31536000 },
    { label: "mo", seconds: 2592000 },
    { label: "w", seconds: 604800 },
    { label: "d", seconds: 86400 },
    { label: "h", seconds: 3600 },
    { label: "m", seconds: 60 },
  ]

  for (const { label, seconds: s } of intervals) {
    const value = Math.floor(seconds / s)
    if (value >= 1) return `${value}${label}${value > 1 ? "s" : ""} ago`
  }
  return "Just now"
}
