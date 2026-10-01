import React, { createContext, useState } from 'react'

let sideBarContext = createContext()

const SideBarContext = ({children}) => {
    const [isOpen,setIsOpen] = useState(false)

  return (
    <sideBarContext.Provider value={{isOpen,setIsOpen}}>
        {children}
    </sideBarContext.Provider>
  )
}
export {sideBarContext}
export default SideBarContext