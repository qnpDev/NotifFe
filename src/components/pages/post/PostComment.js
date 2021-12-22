import React, { useState, useContext, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';

//Icons
import { 
    BiDotsHorizontalRounded,
    BiLike,
} from 'react-icons/bi'
import { BsDot } from 'react-icons/bs'
import { UserContext } from '../../contexts/UserContext';
import api from '../../axios'
import { toast } from 'react-toastify';
import { CloseButton, Modal } from 'react-bootstrap';
import TextareaAutosize from 'react-textarea-autosize';
import ShowMoreText from 'react-show-more-text'
import { confirmAlert } from 'react-confirm-alert'
import { Link } from 'react-router-dom';
import { IoContext } from '../../contexts/IoContext';

function PostComment({ data, authorId, postId, deleteComment }){
    const { userID } = useContext(UserContext)
    const [like, setLike] = useState(data.like.includes(userID.id))
    const [countLike, setCountLike] = useState(data.like.length)
    const [showModal, setShowModal] = useState(false)
    const [dataText, setDataText] = useState(data.text)
    const [text, setText] = useState(data.text)
    const {socket} = useContext(IoContext)
    const handleLike = () => {
        api.post('/post/likecomment', {
            postId,
            commentId: data._id
        }).then(res=>{
            if(res.data.success){
                // if(like)
                //     setCountLike(prev => prev - 1)
                // else
                //     setCountLike(prev => prev + 1)
                // setLike(!like)
            }else
                toast.error(res.data.msg)
        })
    }
    const apiDelete = close => {
        toast.promise(new Promise((resolve, reject) => {
            api.post('/post/deleteComment', {
                postId,
                commentId: data._id
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
            success: 'Delete Successful!',
            error: 'Delete Error!',
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
    const handleShowModal = () => {
        if (showModal === false)
            setText(data.text)
        setShowModal(!showModal)
    }
    const handleText = e => {
        setText(e.target.value)
    }
    const handleUpdate = () => {
        api.post('/post/editComment', {
            postId,
            commentId: data._id,
            text,
        }).then(res=>{
            if(res.data.success){
                toast.success(res.data.msg)
                // setDataText(text)
                handleShowModal()
            }else{
                toast.error(res.data.msg)
            }
        })
    }
    useEffect(() => {
        socket.on('postCommentLike' + data._id, res => {
            if(res.like)
                setCountLike(prev => prev + 1)
            else
                setCountLike(prev => prev - 1)
            if (userID.id === res.idUser)
                setLike(res.like)
        })
        socket.on('postCommentEdit' + data._id, res => {
            setDataText(res.text)
        })
        return () => {
            socket.off('postCommentLike' + data._id)
            socket.off('postCommentEdit' + data._id)
        }
    }, [ socket, data, userID ])
    return (
        <>
        <div className='row py-2 m-0'>
            <div className='col-2 col-lg-1'>
                <div className='d-flex justify-content-center'>
                    <Link to={'/wall/' + data.author._id}>
                        <div className='header_img'> 
                            <img src={data.author ? data.author.avatar : 'https://ephoto360.com/share_image/2021/11/61869a163d0ee.jpg'} alt=''/> 
                        </div>
                    </Link>
                </div>
            </div>
            <div className='col-10 col-lg-11 comment-menu-wraps'>
                <div className='post-comment comment-like-wraps'>
                    <div>
                        <span><b>
                            <Link className='text' to={'/wall/' + data.author._id}>
                                {data.author ? data.author.name : 'User is deleted'}
                            </Link>
                        </b></span>
                        {data.author && data.author._id === authorId ? (
                            <>
                            <span> </span>
                            <span className='post-author p-1 post-date-size'>Author</span>
                            </>
                        ) : null}
                        
                    </div>
                    <div>
                        {dataText && (
                            <ShowMoreText 
                                lines={3}
                                more={(<span className='text fw-bold'>Show more</span>)}
                                less={(<div className='text fw-bold text-center'>Show less</div>)}
                                className="text"
                                expanded={false}
                                width={280}
                                keepNewLines
                                truncatedEndingComponent={"... "}
                            >
                                {dataText}
                            </ShowMoreText>
                        )}
                    </div>
                    <span onClick={handleLike} className={like ? 'comment-like text-primary' : 'comment-like'} title="Like">
                        <BiLike/>
                    </span>
                </div>
                {(userID.per >= 2 || data.author._id === userID.id) && (
                    <div className='post-dropdown comment-menu'>
                        <Dropdown>
                            <Dropdown.Toggle className='btn-nocaret btn-transparent'>
                                <BiDotsHorizontalRounded/>
                            </Dropdown.Toggle>
                            <Dropdown.Menu className='p-0 m-0 bg-light'>
                                <Dropdown.Item
                                    onClick={handleShowModal}
                                    className='text'
                                >Edit</Dropdown.Item>
                                <Dropdown.Item
                                    onClick={handleDelete} 
                                    className='text'
                                >Delete</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                )}
                
                <div className='text-small text-secondary mx-2'>
                    {new Date(data.createdAt).toLocaleString("en-US")}
                    <BsDot/>
                    {countLike} Like
                </div>
            </div>
            
        </div>
        
        <Modal 
            show={showModal}
            size='lg' 
            centered
            onHide={handleShowModal}
        >
            <Modal.Header className='d-flex justify-content-center bg'>
                <Modal.Title id="contained-modal-title-vcenter">
                    Edit Comment
                </Modal.Title>
                <CloseButton onClick={handleShowModal} variant={localStorage.getItem('darkTheme') === 'true' ? 'white' : null}/>
            </Modal.Header>
            <Modal.Body className='bg'>
                <TextareaAutosize
                    value={text}
                    onChange={handleText}
                    className='form-control text bg-transparent border-0'
                    maxRows='7'
                    minRows='5'
                    placeholder="What's on your mind, Q"
                    style={{resize: 'none'}}
                />
            </Modal.Body>
            <Modal.Footer className='bg'>
                <button 
                    className={text ? 'btn btn-primary w-100' : 'btn btn-secondary w-100' }
                    disabled={text ? false : true}
                    onClick={handleUpdate}
                >Update</button>
            </Modal.Footer>
        </Modal>
        </>
    );
};

export default PostComment;