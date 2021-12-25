import { createContext, useContext } from 'react'
import { io } from 'socket.io-client'
import { UserContext } from './UserContext'

const IoContext = createContext()

function IoProvider({ children }){
    const { userID } = useContext(UserContext)
    const socket = userID ? io(process.env.REACT_APP_API_ENDPOINT) : io()

    const handle = {
        socket,
    }

    return (
        <IoContext.Provider value={handle}>
            {children}
        </IoContext.Provider>
    )
}

export { IoContext, IoProvider }