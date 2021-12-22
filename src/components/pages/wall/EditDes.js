import React, { useState } from 'react';
import { CloseButton, Modal } from 'react-bootstrap';
import TextareaAutosize from 'react-textarea-autosize';
import { toast } from 'react-toastify';
import api from '../../axios'
function EditDes({ close, data, setData }) {

    const [ des, setDes ] = useState(data.des)
    const [ name, setName ] = useState(data.name)
    const [ lop, setLop ] = useState(data.lop)
    const [ khoa, setKhoa ] = useState(data.khoa)

    const handleDes = e => setDes(e.target.value)
    const handleName = e => setName(e.target.value)
    const handleLop = e => setLop(e.target.value)
    const handleKhoa = e => setKhoa(e.target.value)
    const handleUpdate = () => {
        api.post('/user/editDes', {
            userId: data.id,
            description: des,
            name,
            lop,
            khoa
        }).then(res => {
            if(res.data.success){
                toast.success(res.data.msg)
                setData.setDes(des)
                setData.setName(name)
                setData.setLop(lop)
                setData.setKhoa(khoa)
                close()
            }else
                toast.error(res.data.msg)
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
                        Update Profile
                    </Modal.Title>
                    <CloseButton onClick={close} variant={localStorage.getItem('darkTheme') === 'true' ? 'white' : null}/>
                </Modal.Header>
                <Modal.Body className='bg'>
                    <div className='mb-3'>
                        <label className='fw-bold'>
                            Name:
                            <span className='text-danger fw-bold'>
                                *
                            </span>
                        </label>
                        <input 
                            type='text'
                            className='form-control text bg input-mind'
                            value={name}
                            onChange={handleName}
                            placeholder='Type your name!'
                        />
                    </div>
                    {data.per < 1 && (
                        <>
                            <div className='mb-3'>
                                <label className='fw-bold'>
                                    Class:
                                </label>
                                <input 
                                    type='text'
                                    className='form-control text bg input-mind'
                                    value={lop}
                                    onChange={handleLop}
                                    placeholder='Type your class!'
                                />
                            </div>
                            <div className='mb-3'>
                                <label className='fw-bold'>
                                    Faculty:
                                </label>
                                <input 
                                    type='text'
                                    className='form-control text bg input-mind'
                                    value={khoa}
                                    onChange={handleKhoa}
                                    placeholder='Type your faculty!'
                                />
                            </div>
                        </>
                    )}
                    <div className='mb-3'>
                        <label className='fw-bold'>
                            Description:
                        </label>
                        <TextareaAutosize
                            value={des}
                            onChange={handleDes}
                            className='form-control text bg input-mind border-0 mt-2'
                            maxRows='7'
                            minRows='5'
                            placeholder='Type your description!'
                            style={{resize: 'none'}}
                        />
                    </div>
                    
                </Modal.Body>
                <Modal.Footer className='bg'>
                    <button 
                        className={name.trim() ? 'btn btn-success w-100' : 'btn btn-secondary w-100' }
                        disabled={name.trim() ? false : true}
                        onClick={handleUpdate}
                    >Update</button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default EditDes;