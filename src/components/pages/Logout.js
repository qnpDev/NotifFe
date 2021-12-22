import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'
import api from '../axios'

function Logout() {
    document.title = 'Logout'
    const navigate = useNavigate()

    const handleLogout = () => {
        api.post('/auth/logout', {
            refreshToken: localStorage.getItem('refreshToken')
        })
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        navigate('/login', {replace: true})

    }
    useEffect(()=> {
        if (!localStorage.getItem('token') || !localStorage.getItem('refreshToken'))
            navigate('/login', {replace: true})
    }, [navigate])
    return (
        <>
        <div className='d-flex justify-content-center'>
            <div className='card px-5 center-v login-main'>
                <div className='card-body p-5'>
                    <div className='text-center'>
                        <h1>Logout</h1>
                    </div>
                    <div className='mt-5'>
                        <div className='text-center text-warning'>Do you want to logout!</div>
                        <div className='text-end mt-3'>
                            <button
                                onClick={() => navigate(-1)}
                                className='btn btn-secondary text-white mx-1 px-3'
                            >Back
                            </button>
                            <button 
                                onClick={handleLogout}
                                className='btn btn-info text-white mx-1 px-4'
                            >Yes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}
export default Logout
