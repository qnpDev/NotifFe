import React, { useEffect, useState } from 'react'
import api from '../axios'
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from 'react-google-login'

//Icons
import { BsGoogle } from 'react-icons/bs'


function Login() {
    document.title = 'Login | Notìication'
    const [darkTheme, setDarkTheme] = useState(localStorage.getItem('darkTheme') === 'true' ? true : false)
    const [btnSubmit,  setBtnSubmit] = useState(false)
    const navigate = useNavigate();

    const error = message => {
        toast.error(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }
    
    const handleSubmit = e => {
        e.preventDefault()
        const username = e.target.username.value
        const password = e.target.password.value
        
        if(username === '') {
            error('Please enter Username!')
            e.target.username.focus()
        }else if (username.match('^[a-zA-Z0-9][a-zA-Z0-9_]*[a-zA-Z0-9](?<![-?+?*$]{6,}.*)$') === null){
            error('Username must two characters at least and have no special characters!')
            e.target.username.focus()
        }else if(password === '') {
            error('Please enter Password!')
            e.target.password.focus()
        }else if(password.length <= 3){
            error('Password must four characters at least!')
            e.target.password.focus()
        }else{
            toast.promise(new Promise((resolve, reject) => {
                setBtnSubmit(true)
                api.post('/auth/login', {
                    username,
                    password
                }).then(res=>{
                    if (res.data.success){
                        const {token, refreshToken} = res.data
                        localStorage.setItem('token', token)
                        localStorage.setItem('refreshToken', refreshToken)
                        navigate('/')
                        resolve()
                    }else{
                        setBtnSubmit(false)
                        reject()
                    }
                })

            }), {
                pending: 'Wait...',
                success: 'Login successful!',
                error: 'Invalid username or password!'
            })
        }
        
    }

    const onGoogleSuccess = response => {
        const { tokenId, profileObj } = response

        toast.promise(new Promise((resolve, reject) => {
            api.post('/auth/google', {
                tokenId,
                profileObj
            }).then(res => {
                if (res.data.success){
                    const {token, refreshToken} = res.data
                    localStorage.setItem('token', token)
                    localStorage.setItem('refreshToken', refreshToken)
                    navigate('/')
                    resolve()
                }else{
                    reject()
                }
            })

        }), {
            pending: 'Wait...',
            success: 'Login successful!',
            error: 'Login false!'
        })
    }

    const handleChangeTheme = () => setDarkTheme(!darkTheme)
    useEffect(()=>{
        const variableTheme = [
            { name: '--first-color', dark: '#18191a', default: '#2378d9' },
            { name: '--white-color', dark: 'black', default: '#F7F6FB' },
            { name: '--header-color', dark: '#18191a', default: 'rgb(196, 220, 250)' },
            { name: '--foot-color', dark: 'black', default: 'rgba(0,0,0,0.5)' },
            { name: '--post', dark: '#242526', default: 'white' },
            { name: '--post-comment', dark: 'rgb(44, 44, 44)', default: '#ebebeb' },
            { name: '--post-author', dark: 'rgb(118, 116, 121)', default: 'rgb(224, 219, 219)' },
            { name: '--text-color', dark: 'white', default: 'black' },
            { name: '--bg', dark: 'black', default: 'white' },
            { name: '--toggle-color', dark: 'white', default: '#2378d9' },
            { name: '--input', dark: '#3a3b3c', default: '#f8f9fa' },
            { name: '--border', dark: '#3a3b3c', default: '#e4e6eb' },
        ]
        if(darkTheme)
            variableTheme.map(e => document.documentElement.style.setProperty(e.name, e.dark))
        else
            variableTheme.map(e => document.documentElement.style.setProperty(e.name, e.default))
        localStorage.setItem('darkTheme', darkTheme)
    }, [darkTheme])

    useEffect(() => {
        if (localStorage.getItem('token') || localStorage.getItem('refreshToken')){
            api.get('/user/id').then(res=> {
                if(res.data.success)
                    navigate('/')
            })
        }
    }, [navigate])

    return (
        <>
        <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme='colored'
            />
        <div 
            className='d-flex justify-content-center'
            style={{minHeight: '100vh'}}
        >
            <div className='header'>
                <div className='text fw-bold'>qnp | NOTIFICATION</div>
                    <label className="theme-switch" htmlFor="checktheme">
                        <input 
                                checked={darkTheme} 
                                onChange={handleChangeTheme} 
                                type="checkbox" 
                                id="checktheme" 
                                className='checktheme' 
                            />
                        <div className="slider round"></div>
                    </label>
            </div>
            <div className='center-v'>
                <div className='card login-main h-100 m-2'>
                    <div className='card-body p-5'>
                        <div className='text-center'>
                            <h1 className='m-0'>Login</h1>
                            <div className='text-small text-secondary'>
                                qnp Notification
                            </div>
                        </div>
                        <div className='row mt-5'>
                            <div className='col-6 login-border-right d-flex align-items-center'>
                                <GoogleLogin
                                    clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                                    buttonText="Sign in with Google"
                                    onSuccess={onGoogleSuccess}
                                    onFailure={() => error("Somethings Wrong!")}
                                    cookiePolicy={'single_host_origin'}
                                    render={renderProps => (
                                        <button 
                                            onClick={renderProps.onClick} 
                                            className='login-btn-google text-white'>
                                            <BsGoogle/>
                                            <span className='text-white'> Sign in with google</span>
                                        </button>
                                      )}
                                />
                            </div>
                            <div className='col-6'>
                                <form onSubmit={handleSubmit}>
                                    <div className='input-group'>
                                        <input
                                            className='form-control input-mind bg-light text'
                                            name='username'
                                            placeholder='Username'
                                        />
                                    </div>
                                    <div className='input-group mt-2'>
                                        <input
                                            type='password'
                                            className='form-control input-mind bg-light text'
                                            name='password'
                                            placeholder='Password'
                                        />
                                    </div>
                                    <div className='text-center mt-3'>
                                        <button disabled={btnSubmit} className='btn btn-info text-white'>Login</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            <footer className='text-center'>
                <div className="text-center p-3 text-white cursor-default">
                    <span className='text'>© 2021 Copyright: </span>
                    <a href='https://facebook.com/100029121395944' className="text-info font-weight-bold">
                        Nguyễn Phú Quí
                    </a>
                </div>
            </footer>
        </>
    )
}
export default Login
