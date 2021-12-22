import React, { useImperativeHandle, forwardRef, useRef, useContext, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import api from '../../axios'
//Icons
import { BiSend } from 'react-icons/bi'
import TextareaAutosize from 'react-textarea-autosize';
import { toast } from 'react-toastify';

const PostNewComment = ({ data, addComment }, ref, ) => {
    const commentRef = useRef()
    const { userID } = useContext(UserContext)
    const [ text, setText ] = useState()

    const handleText = e => {
        setText(e.target.value)
    }

    const handleComment = () => {
        toast.promise(new Promise((resolve, reject) => {
            api.post('/post/newComment', {
                postId: data,
                text
            }).then(res=>{
                if (res.data.success){
                    setText('')
                    resolve()
                }else{
                    reject()
                }
            })

        }), {
            pending: 'Wait...',
            success: 'Successful!',
            error: 'Somethings wrong!',
        })
        // api.post('/post/newComment', {
        //     postId: data,
        //     text
        // }).then(res=>{
        //     if(res.data.success){
        //         setText('')
        //         // addComment(res.data.data)
        //     }else{
        //         toast.error('Somethings wrong!')
        //     }
        // })
    }
    
    useImperativeHandle(ref, ()=> ({
        focus() {
            commentRef.current.focus()
        }
    }))

    return (
        <div className='my-2  mx-0'>
            <div className='border-top'>
                <div className='row my-1 mx-0'>
                    <div className='col-1'>
                        <div className='d-flex justify-content-center'>
                            <div className='post-img-new-comment'> 
                                <img src={userID.avatar} alt=''/> 
                            </div>
                        </div>
                    </div>
                    <div className='col-10 m-0 p-0'>
                        <div className='input-group'>
                            <TextareaAutosize
                                value={text}
                                onChange={handleText}
                                ref={commentRef}
                                maxRows='3'
                                className='form-control input-mind bg-light'
                                placeholder='Write comment'
                            />
                        </div>
                    </div>
                    <div className='col-1 m-0 p-0 d-flex align-items-center'>
                        <button 
                            onClick={handleComment}
                            className='btn-transparent text-primary text-center'
                        >
                            <BiSend/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default forwardRef(PostNewComment);