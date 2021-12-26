import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router';
import api from '../../axios'
import { UserContext } from '../../contexts/UserContext';
import { confirmAlert } from 'react-confirm-alert'

//Icons
import { FiEdit2 } from 'react-icons/fi'
import { BiMessageRoundedEdit } from 'react-icons/bi'
//Components
import NewPost from '../post/NewPost';
import Post from '../post/Post';
import Error from '../Error';
import Loading from '../loading';
import EditDes from './EditDes';
import EditWallpaper from './EditWallpaper';
import EditAvatar from './EditAvatar';
const Wall = () => {
    document.title = 'Wall'

    const { id } = useParams()
    const [ user, setUser ] = useState()
    const [ post, setPost ] = useState()
    const [ limit, setLimit ] = useState(0)
    const { userID } = useContext(UserContext)
    const [ scrolling, setScrolling] = useState()
    const [ seeMore, setSeeMore ] = useState(true)
    const [ endPost, setEndPost ] = useState(false)
    const [ des, setDes ] = useState()
    const [ wallpaper, setWallpaper ] = useState()
    const [ avatar, setAvatar ] = useState()
    const [ err, setErr ] = useState(false)
    const [ name, setName ] = useState('')
    const [ lop, setLop ] = useState('')
    const [ khoa, setKhoa ] = useState('')
    const [ per, setPer ] = useState()

    const handleDelete = useCallback(id => {
        setPost(prev => prev.filter(value => value._id !== id))
    }, [])

    const handleDes = () => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <EditDes close={onClose} data={{ id: user.user._id, des, name, lop, khoa, per}} setData={{setDes, setName, setLop, setKhoa}}/>
                )
            }
        })
    }
    const handleWallpaper = () => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <EditWallpaper close={onClose} data={{id: user.user._id, wallpaper}} setData={setWallpaper}/>
                )
            }
        })
    }
    const handleAvatar = () => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <EditAvatar close={onClose} data={{id: user.user._id, avatar}} setData={setAvatar}/>
                )
            }
        })
    }

    useEffect(()=>{
        api.get('/user', {params: { id }}).then(res=>{
            if(res.data.success){
                setUser(res.data)
                setDes(res.data.user.description)
                setWallpaper(res.data.user.wallpaper)
                setAvatar(res.data.user.avatar)
                setName(res.data.user.name)
                if(res.data.user.per){
                    setPer(res.data.user.per.permission)
                    if(res.data.user.per.class)
                        setLop(res.data.user.per.class)
                    if(res.data.user.per.faculty)
                        setKhoa(res.data.user.per.faculty)
                }
                
            }else{
                setErr(true)
            }
            
        })
    }, [ id ])
    useEffect(()=>{
        setSeeMore(false)
        api.get('/user/post', {
            params: { id, limit }
            }).then(res=>{
                if(res.data.success)
                    if (res.data.post.length === 0){
                        setPost(prev => prev && res.data.post ? [...prev, ...res.data.post] : res.data.post)
                        setEndPost(true)
                    }else{
                        setPost(prev => prev && res.data.post ? [...prev, ...res.data.post] : res.data.post)
                    }
                else
                    setErr(true)
                setSeeMore(true)
        })
    }, [ limit, id ])
    
    useEffect(() => {
        return () => {
            setPost(null)
            setLimit(0)
        }
    }, [ id ])

    useEffect(() => {
        const onScroll = () => {
          setScrolling(window.innerHeight + document.documentElement.scrollTop)
        };
        window.addEventListener("scroll", onScroll)
    
        return () => window.removeEventListener("scroll", onScroll)
    }, []);

    useEffect(() => {
        if (scrolling >= document.documentElement.offsetHeight - 1 && seeMore && !endPost){
            setLimit(prev => prev + 1)
        } 
    }, [scrolling, seeMore, endPost])

    if(err)
        return ( <Error />)

    if (user && post){
        if (!user.success)
            return ( <Error/> )
        document.title = 'Wall | ' + name
    return (
        <>
            <div className='wall-parent'>
                <img 
                    className='wall-wallpaper'
                    src={wallpaper}
                    alt='wallpaper'
                />
                {(userID.per >= 2 || userID.id === user.user._id) && (
                <div className='wall-wallpaper-edit d-flex align-items-center'>
                    <button
                        onClick={handleWallpaper}
                        className='btn-transparent text-small text-primary'
                    >
                        <BiMessageRoundedEdit/>
                    </button>
                </div>
                )}
                <img 
                    className='wall-avatar'
                    src={avatar}
                    alt='avatar'
                />
                {(userID.per >= 2 || userID.id === user.user._id) && (
                <div className='wall-avatar-edit d-flex align-items-center'>
                    <button
                        onClick={handleAvatar}
                        className='btn-transparent text-small text-primary'
                    >
                        <BiMessageRoundedEdit/>
                    </button>
                </div>
                )}
            </div>
            <div className='mt-3 text-center text border-bottom pb-4'>
                <div className='fw-bold'>
                    <h1>{name}</h1>
                </div>
                {per < 1 && (
                    <>
                        <div className='text'>
                            <span>{lop}</span>
                            {lop && khoa && (
                                <span> - </span>
                            )}
                            <span>{khoa}</span>
                        </div>
                    </>
                )}
                <div className='text-secondary text-small'>
                    <span>{des}</span>
                </div>
                {(userID.per >= 2 || userID.id === user.user._id) && (
                    <button
                        onClick={handleDes}
                        className='btn-transparent text-small'
                    >
                        <FiEdit2/>
                    </button>
                )}
                
            </div>
            <div className='px-3'>
            {(userID.id === id || !id) && (
                <div className='mt-3'>
                    <NewPost user={user.user} setPost={setPost}/>
                </div>
            )}
            
            {post.length === 0 ? (
                <div className='mt-3 card'>
                    <div className='card-body text-center'>
                        <h3>There are no posts!</h3>
                    </div>
                </div>
            ) : (
                <div className='mt-3'>
                    {post.map(value => 
                        <Post key={value._id} data={value} deletePost={handleDelete} />
                    )}
                    {!seeMore && (
                        <>
                            <div className='card btn-transparent'>
                                <div className='card-body text-center btn-transparent'>
                                    <Loading />
                                </div>
                            </div>
                        </>
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
                </div>
            )}
            </div>
        </>
    );
    }else return (<Loading/>)
};

export default Wall;