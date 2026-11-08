import React,{useEffect,useState,useRef} from 'react'
import {useNavigation} from "react-router-dom"

const ApiLoader = () => {
  const navigation = useNavigation()
  const isLoading = navigation.state !== "idle"
  const [progress,setProgress] = useState(0)
  const [visible,setVisible] = useState(false)
  const wasLoading = useRef(false)

  useEffect(() => {
    let interval , hideLoader;

    if(isLoading){
      wasLoading.current = true
      setProgress(10)
      setVisible(true)
      interval = setInterval(() => {
        setProgress((p) => p + (90 - p) * 0.1)
      }, 200)

    }
    else if(wasLoading.current){
      wasLoading.current = false
      setProgress(100)
      hideLoader = setTimeout(()=>{
        setVisible(false)
        setProgress(0)
      },300)

    }
  
    return () => {
      clearInterval(interval)
      clearTimeout(hideLoader)
    }
  }, [isLoading])
  

  return (
    <div className={`fixed top-0 left-0 h-px w-full z-200 bg-[#565656] pointer-events-none`}
    style={{
      opacity : visible ? 1 : 0
    }}>
      <div className='h-full bg-red-600 transition-[width] duration-900 ease-out'
      style={{width : `${progress}%`,opacity : visible ? 1 : 0}}
      ></div>
    </div>
  )
}

export default ApiLoader