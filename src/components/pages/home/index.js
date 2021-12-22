import React, { useState, useEffect, useCallback, useContext } from 'react'
import api from '../../axios'

import NewPost from '../post/NewPost'
import Notification from './Notification'
import Post from '../post/Post'
import { toast } from 'react-toastify'
import { IoContext } from '../../contexts/IoContext'
import { useNavigate } from 'react-router-dom'
import { IoNotificationsSharp } from 'react-icons/io5'
import Loading from '../loading'

function Home() {
    document.title = 'Home'

    const navigate = useNavigate()
    const [ user, setUser ] = useState()
    const [ limitPost, setLimitPost ] = useState(0)
    const [ post, setPost ] = useState()
    const [ notification, setNotification ] = useState()
    const [ scrolling, setScrolling] = useState()
    const [ seeMore, setSeeMore ] = useState(true)
    const [ endPost, setEndPost ] = useState(false)
    const [ pushNotif, setPushNotif ] = useState()
    const { socket } = useContext(IoContext)

    const handleDelete = useCallback(id => {
        setPost(prev => prev.filter(value => value._id !== id))
    }, [])
    useEffect(()=>{
        api.get('/user').then(res=>{
            setUser(res.data)
        })
        api.get('/notification/new').then(res=>{
            if(res.data.success){
                setNotification(res.data.data)
            }else{
                toast.error(res.data.msg)
            }
        })
    }, [])
    useEffect(()=>{
        setSeeMore(false)
        api.get('/post', { params: {limit: limitPost }}).then(res=>{
            if (res.data.length === 0){
                setPost(prev => prev && res.data ? [...prev, ...res.data] : res.data)
                setEndPost(true)
            }else{
                setPost(prev => prev && res.data ? [...prev, ...res.data] : res.data)
            }
        })
        setSeeMore(true)
    }, [ limitPost ])

    useEffect(() => {
        const onScroll = () => {
          setScrolling(window.innerHeight + document.documentElement.scrollTop)
        };
        window.addEventListener("scroll", onScroll)
    
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if (scrolling >= document.documentElement.offsetHeight - 1 && seeMore && !endPost){
            setLimitPost(prev => prev + 1)
        } 
    }, [scrolling, seeMore, endPost])

    useEffect(() => {
        socket.on('notifNew', res => {
            setNotification(prev => [res, ...prev])
            setPushNotif(res)
        })
    }, [ socket ])

    return (
        <>
            <div className='row'>
                <div className='col-12 col-md-8'>
                    {pushNotif && (
                        <div className="alert alert-warning" role="alert" style={{textTransform: 'uppercase'}}>
                            <span className='fw-bold text-danger'><IoNotificationsSharp/> </span>
                            <span 
                                className='cursor-pointer'
                                onClick={()=> navigate('/notification/' + pushNotif._id)}>
                                {pushNotif.name}
                            </span>
                        </div>
                    )}
                    {user ? <NewPost user={user.user} setPost={setPost} realtime={true}/> :
                        <Loading />
                    }
                    {post ? (
                        post.length === 0 ? (
                            <div className='my-3 card'>
                                <div className='card-body text-center'>
                                    <h3>There are no posts!</h3>
                                </div>
                            </div>
                        ) : (
                                <>
                                {post.map(value=>
                                    <Post key={value._id} data={value} deletePost={handleDelete}/>
                                )}

                                {!seeMore && (
                                    <Loading />
                                )}

                                {endPost && (
                                    <div className='card'>
                                        <div className='card-body text-center'>
                                            <div className='w-100 h-100 btn-transparent cursor-default'>
                                                ...Reached the bottom of the page...
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                </>
                            )
                    ) : (
                        <Loading />
                    )}
                    
                    
                </div>
                <div className='col-12 col-md-4 mb-3 position-relative home-notification-container'>
                    <div className='home-notification'>
                        <Notification data={notification}/>
                    </div>
                </div>
            </div>
            
        </>
    );
};

export default Home;