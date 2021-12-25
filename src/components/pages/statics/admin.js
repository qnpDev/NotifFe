import React, { useState, useEffect, useMemo, useContext } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from '../../contexts/UserContext';
import ErrorPer from '../admin/ErrorPer'
// Icons
import { 
    BiAlignLeft,
    BiLogOut,
    BiUser,
    BiListUl,
} from 'react-icons/bi'
import { 
    IoConstructOutline,
    IoHomeOutline,
} from 'react-icons/io5'
import { AiOutlineNotification } from 'react-icons/ai'
import { SiDependabot } from 'react-icons/si'
import api from '../../axios';
import Loading from '../loading';


const Static = () => {

    const [nav, setNav] = useState(false)
    const [darkTheme, setDarkTheme] = useState(localStorage.getItem('darkTheme') === 'true' ? true : false)

    const {userID, setUserID} = useContext(UserContext)

    const handleNav = () => {
        setNav(!nav)
    }
    
    const handleChangeTheme = () => setDarkTheme(!darkTheme)
    useMemo(()=>{
        const variableTheme = [
            { name: '--first-color', dark: '#18191a', default: 'rgb(38, 62, 197)' },
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
    const navigate = useNavigate()
    useEffect(() => {
        if (!localStorage.getItem('token') || !localStorage.getItem('refreshToken')){
            navigate('/login', {replace: true})
        }else
        api.get('/user/id').then(res=> {
            if(res.data.success)
                setUserID({ id: res.data.id, avatar: res.data.avatar, per: res.data.per})
            else
                navigate('/login', {replace: true})
        })
    }, [navigate, setUserID])

    if (userID){
        if (userID.per < 2)
            return (
                <ErrorPer/>
            )
    return (
        <>
            <header className={(nav) ? 'body-pd' : ''}>
                <div className={(nav) ? 'header body-pd' : 'header'}>
                    <div className='header_toggle'>
                        <BiAlignLeft onClick={handleNav}/>
                    </div>
                    <div className='header_img'>
                        <img 
                            src={userID.avatar}
                            alt='avatar'
                        />
                    </div>
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
                <div className={(nav) ? 'l-navbar nav-show' : 'l-navbar'}>
                    <div className='nav'>
                        <div> 
                            <div className='nav_logo text-white cursor-default'>
                                <IoConstructOutline/>
                                <span className='nav_logo-name'>AdminPanel</span>
                            </div>
                            <div className='nav_list'> 
                                <NavLink 
                                    end
                                    to='/admin' 
                                    activeclassname='active'
                                    className='nav_link'
                                >
                                    <IoHomeOutline/>
                                    <span className='nav_name'>Dashboard</span> 
                                </NavLink> 
                                <NavLink 
                                    to='/admin/users'
                                    activeclassname='active' 
                                    className='nav_link'
                                > 
                                    <BiUser/>
                                    <span className='nav_name'>Users</span> 
                                </NavLink>
                                <NavLink 
                                    to='/admin/department'
                                    activeclassname='active' 
                                    className='nav_link'
                                > 
                                    <BiListUl/>
                                    <span className='nav_name'>Department List</span> 
                                </NavLink>
                                <NavLink 
                                    to='/admin/notification'
                                    activeclassname='active' 
                                    className='nav_link'
                                > 
                                    <AiOutlineNotification/>
                                    <span className='nav_name'>Notifications</span> 
                                </NavLink>
                                <NavLink 
                                    to='/admin/about'
                                    activeclassname='active' 
                                    className='nav_link'
                                > 
                                    <SiDependabot/>
                                    <span className='nav_name'>About Me</span> 
                                </NavLink>

                                <NavLink to='/' className='nav_link'>
                                    <BiLogOut/>
                                    <span className='nav_name'>Go to Home</span> 
                                </NavLink>

                                {/* <NavLink to='/logout' className='nav_link'>
                                    <BiLogOut/>
                                    <span className='nav_name'>SignOut</span> 
                                </NavLink> */}
                                
                            </div>
                        </div> 
                        <NavLink to='/logout' className='nav_link'>
                            <BiLogOut/>
                            <span className='nav_name'>SignOut</span> 
                        </NavLink>
                    </div>
                </div>
            </header>

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

            <div className={(nav) ? 'main body-main' : 'main'}>
                <div className='height-100'>
                    <Outlet />
                </div>
            </div>

            <footer className='text-center foot'>
                <div className="text-center p-3 text-white cursor-default">
                    <span>© 2021 Copyright: </span>
                    <Link to='/admin/about' className="text-info font-weight-bold">
                        Nguyễn Phú Quí
                    </Link>
                </div>
            </footer>
        </>
    );
    }else
        return (<Loading/>)
};

export default Static;