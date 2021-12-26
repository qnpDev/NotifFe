import React, { useState, useCallback, useRef, useContext, useEffect } from 'react';
import api from '../../axios'
import ShowImages from '../../images';
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
// Icons
import {
    MdGroups,
    MdDeleteForever,
} from 'react-icons/md'
import { 
    BiDotsHorizontalRounded,
    BiLike,
    BiEdit,
} from 'react-icons/bi'
import { BsDot } from 'react-icons/bs'
import { GoComment } from 'react-icons/go'

//Components
import PostComment from './PostComment';
import PostNewComment from './PostNewComment';
import PostEdit from './PostEdit';
import ReactPlayer from 'react-player';
import { Link } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { toast } from 'react-toastify';
import ShowMoreText from 'react-show-more-text'
import { confirmAlert } from 'react-confirm-alert'
import { IoContext } from '../../contexts/IoContext';
import LikeDetail from './LikeDetail';

const Post = ({ data, deletePost }) => {

    const [ dataPost, setDataPost ] = useState(data)
    const [ dataLike, setDataLike ] = useState(data.like)
    const [ modalEdit, setModalEdit ] = useState(false)
    const commentRef = useRef()
    // const [ countLike, setCountLike ] = useState(dataPost.like ? dataPost.like.length : null)
    const { userID } = useContext(UserContext)
    const [ comment, setComment ] = useState(dataPost.comment)
    const [ limitComment, setLimitComment ] = useState(1)
    // const [ like, setLike ] = useState(dataPost.like.includes(userID.id))
    const [ like, setLike ] = useState(dataPost.like.filter(v => v._id === userID.id).length > 0)
    const { socket } = useContext(IoContext)

    const handleEdit = useCallback(
        () => {
            setModalEdit(!modalEdit)
        },
        [modalEdit],
    )
    const handleLike = () => {
        api.post('/post/like', {
            postId: dataPost._id
        }).then(res=>{
            if(res.data.success){
                // setLike(res.data.msg)
                // if(res.data.msg)
                //     setCountLike(prev => prev + 1)
                // else
                //     setCountLike(prev => prev - 1)
            }else{
                toast.error(res.data.msg)
            }
        })
    }
    const handleSeeComment = () => {
        setLimitComment(prev => prev + 1)
    }
    const apiDelete = close => {
        toast.promise(new Promise((resolve, reject) => {
            api.post('/post/delete', {
                id: dataPost._id
            }).then(res=>{
                if (res.data.success){
                    close()
                    resolve()
                }else{
                    reject()
                }
            })

        }), {
            pending: 'Wait...',
            success: 'Delete successful!',
            error: 'Delete error!'
        })
    }
    const handleDelete = () => {
        confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <div className='card'>
                    <div className='card-header text-center'>
                        <h1>Are you sure?</h1>
                    </div>
                    <div className='card-body'>
                        <p>You want to delete this?</p>
                        <div className='d-flex justify-content-end'>
                            <button className='btn btn-secondary mx-1' onClick={onClose}>No</button>
                            <button
                                className='btn btn-danger mx-1'
                                onClick={() => apiDelete(onClose)}
                            >
                                Yes, Delete it!
                            </button>
                        </div>
                        
                    </div>
                  
                </div>
              );
            }
          });
    }
    const handleLikeDetail = () => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <LikeDetail close={onClose} data={dataLike}/>
                )
            }
        })
    }
    const handleDeleteComment = useCallback(id => {
        setComment(prev => prev.filter(value => value._id !== id))
    },[])

    useEffect(() => {
        socket.on('postDelete' + dataPost._id, res => {
            deletePost(res)
        })
        socket.on('postEdit' + dataPost._id, res => {
            setDataPost(prev => ({
                ...prev,
                img: res.img,
                text: res.text,
                video: res.video
            }))
        })
        socket.on('postLike' + dataPost._id, res => {
            if (userID.id === res.idUser)
                setLike(res.like)
            // setCountLike(res.countLike)
            setDataLike(res.data)
        })
        socket.on('postCommentNew' + dataPost._id, res => {
            setComment(res.comment)
        })
        socket.on('postCommentDelete' + dataPost._id, res => {
            setComment(prev => prev.filter(value => value._id !== res.commentId))
        })
        return () => {
            socket.off('postDelete' + dataPost._id)
            socket.off('postEdit' + dataPost._id)
            socket.off('postLike' + dataPost._id)
            socket.off('postCommentNew' + dataPost._id)
            socket.off('postCommentDelete' + dataPost._id)
        }
    }, [ socket, dataPost, deletePost, comment, userID ])


    return (
        <>
        {modalEdit && (
            <PostEdit setData={setDataPost} data={dataPost} show={modalEdit} handleEdit={handleEdit}/>
        )}
        <div className='card mb-3'>
            <div className='card-body p-0'>
                <div className='row py-3'>
                    <div className='col-11 '>
                        <div className='row p-0 m-0'>
                            <div className='col-2 col-lg-1'>
                                <div className='d-flex justify-content-center'>
                                    <Link 
                                        to={'/wall/' + dataPost.author._id} 
                                        className='header_img'
                                    >
                                        <img src={dataPost.author.avatar} alt='avatar'/>
                                    </Link>
                                </div>
                            </div>
                            <div className='col-10 col-lg-11 m-0 p-0'>
                                <div>
                                    <b>
                                        <Link className='text' to={'/wall/' + dataPost.author._id}>{dataPost.author.name}</Link>
                                    </b>
                                </div>
                                <div className='post-date-size text-secondary fst-italic'>
                                    {dataPost.updatedAt ? (
                                         <>
                                            <span>{(new Date(dataPost.updatedAt).toLocaleString("en-US")) + ' updated'}</span>
                                            <span> <BsDot/> </span>
                                            <span><MdGroups/></span>
                                        </>
                                    ) : (
                                        <>
                                            <span>{new Date(dataPost.createdAt).toLocaleString("en-US")}</span>
                                            <span> <BsDot/> </span>
                                            <span><MdGroups/></span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-1 m-0 p-0 post-dropdown'>
                        {(userID.per >= 2 || dataPost.author._id === userID.id) && (
                            <Menu 
                                menuButton={<MenuButton 
                                    className='p-0 m-0 btn-nocaret btn-transparent'
                                    ><BiDotsHorizontalRounded/></MenuButton>}
                            >
                                <MenuItem onClick={handleEdit}>
                                    <div><BiEdit/> Edit</div>
                                </MenuItem>
                                <MenuItem onClick={handleDelete}>
                                    <div><MdDeleteForever/> Delete</div>
                                </MenuItem>
                            </Menu>
                        )}
                        
                    </div>
                </div>
                
                    {dataPost.text && (
                        (dataPost.img.length > 0 || dataPost.video) ? (
                            <ShowMoreText 
                                lines={3}
                                more={(<span className='text fw-bold fst-italic'>Show more</span>)}
                                less={(<div className='text fw-bold text-center fst-italic'>Show less</div>)}
                                className="text px-3 post-text"
                                expanded={false}
                                width={280}
                                keepNewLines
                                truncatedEndingComponent={"... "}
                            >
                                {dataPost.text}
                            </ShowMoreText>
                        ) : (
                            <>
                            <div className='post-content'>
                                <ShowMoreText 
                                    lines={3}
                                    more={(<div className='text-white fw-bold fst-italic'>Show more</div>)}
                                    less={(<div className='text-white fw-bold text-center fst-italic'>Show less</div>)}
                                    className="text-white text-center post-content-text fw-bold"
                                    expanded={false}
                                    width={280}
                                    keepNewLines
                                    truncatedEndingComponent={"... "}
                                >
                                    {dataPost.text}
                                </ShowMoreText>
                            </div>
                            </>
                            
                        )
                    )}
                
                

                {dataPost.img && dataPost.img.length > 0 && (
                    <div className='mt-1'>
                        <ShowImages
                            images={dataPost.img}
                        />
                    </div>
                )}

                {dataPost.video && (
                    <div className='mt-1'>
                        <div className='text-center mt-1'>
                            <ReactPlayer 
                                url={dataPost.video}
                                controls={true}
                                width='50'
                            />
                        </div>
                    </div>
                    )}
                <div className='row p-2 px-3 text-small'>
                    <div className='col-6'>
                        <span 
                            onClick={handleLikeDetail}
                            className='cursor-pointer'><BiLike className='text-info'/> {dataLike.length}</span>
                    </div>
                    <div className='col-6'>
                        <span className='d-flex justify-content-end'>{comment.length} Comments</span>
                    </div>
                </div>
                <div className="border-top border-bottom">
                    <div className='row p-2 text-center'>
                        <div className='col-6'>
                            <button 
                                onClick={handleLike}
                                className={like ? 'post-btn text-primary' : 'post-btn'}
                            ><BiLike/> Like</button>
                        </div>
                        <div className='col-6'>
                            <button
                                onClick={() => commentRef.current.focus()}
                                className='post-btn'
                            ><GoComment/> Comment</button>
                        </div>
                    </div>
                </div>
                {(comment.length > 0 && comment.length > 3*limitComment) && (
                    <div className='text-secondary m-2'>
                        <button
                            onClick={handleSeeComment}
                            className='post-btn-default'
                        >
                            See <b>{comment.length - 3*limitComment}</b> more comments
                        </button>
                    </div>
                )}
                
                {comment && (
                    comment.map((value, index)=> 
                        (index >= (comment.length - 3*limitComment)) && (
                            <PostComment 
                                key={index} 
                                data={value} 
                                authorId={dataPost.author._id} 
                                postId={dataPost._id}
                                deleteComment={handleDeleteComment}
                            />
                        )
                    )
                )}
                

                <PostNewComment ref={commentRef} data={dataPost._id}/>

            </div>
        </div>
        </>
    );
};

export default Post;