import {create} from 'zustand'

const useAuthStore = create((set)=>(
    {
        user : null,
        setUser : (newUser)=>set({
            user : newUser,
            isAuthLoading : false
        }),
        clearUser : () => set({user : null,isAuthLoading : false}),
        isAuthLoading : true
    }
))
export {useAuthStore}