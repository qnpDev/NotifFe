import { createContext, useState } from 'react'

const UserContext = createContext()

function UserProvider({ children }){
    const [ userID, setUserID ] = useState()



    const handle = {
        userID,
        setUserID
    }

    return (
        <UserContext.Provider value={handle}>
            {children}
        </UserContext.Provider>
    )
}

export { UserContext, UserProvider }