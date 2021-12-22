import React, { useState } from 'react';
import { CloseButton, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../../axios'
import TextareaAutosize from 'react-textarea-autosize';

function PostEditComment({data, postId, commentId, close}) {
    const [ text, setText ] = useState(data)

    const handleText = e => setText(e.target.value)

    const handleUpdate = () => {
        toast.promise(new Promise((resolve, reject) => {
            api.post('/post/editComment', {
                postId,
                commentId,
                text,
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
            success: 'Update Successful!',
            error: 'Update Error!',
        })
    }
    return (
        <>
            <Modal 
            show={true}
            size='lg' 
            centered
            onHide={close}
        >
            <Modal.Header className='d-flex justify-content-center bg'>
                <Modal.Title id="contained-modal-title-vcenter">
                    Edit Comment
                </Modal.Title>
                <CloseButton onClick={close} variant={localStorage.getItem('darkTheme') === 'true' ? 'white' : null}/>
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
}

export default PostEditComment;