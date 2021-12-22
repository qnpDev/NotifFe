import React, { useState } from 'react';
import { CloseButton, Modal } from 'react-bootstrap';
import TextareaAutosize from 'react-textarea-autosize';
import { AiFillDelete } from 'react-icons/ai'
import api from '../../../axios'
import { toast } from 'react-toastify';

function UpdateStudent({ close, data, setList }) {
    const [ name, setName ] = useState(data.name)
    const [ avatar, setAvatar ] = useState(data.avatar)
    const [ wallpaper, setWallpaper ] = useState(data.wallpaper)
    const [ per, setPer ] = useState(data.per.permission)
    const [ description, setDescription ] = useState(data.description)
    const [ lop, setLop ] = useState(data.per.class)
    const [ faculty, setFaculty ] = useState(data.per.faculty)

    const handleAvatar = e => setAvatar(e.target.value)
    const handleWallpaper = e => setWallpaper(e.target.value)
    const handleName = e => setName(e.target.value)
    const handleDescription = e => setDescription(e.target.value)
    const handleLop = e => setLop(e.target.value)
    const handleFaculty = e => setFaculty(e.target.value)
    const handlePer = e => setPer(e.target.value)
    const handleDelAvatar = e => setAvatar('')
    const handleDelWallpaper = e => setWallpaper('')
    const handleUpdate = () => {
        api.post('/admin/users/editStudent', {
            id: data._id,
            name,
            permission: per,
            wallpaper,
            avatar,
            lop,
            faculty,
        } ).then(res=>{
            if(res.data.success){
                setList(prev => prev.map(value =>
                    value._id === data._id
                        ? res.data.data
                        : value
                ))
                toast.success('Update successful!')
                close()
            }else{
                toast.error(res.data.msg)
            }
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
                        Update Student
                    </Modal.Title>
                    <CloseButton onClick={close} variant={localStorage.getItem('darkTheme') === 'true' ? 'white' : null}/>
                </Modal.Header>
                <Modal.Body className='bg'>
                    <div className='wall-parent'>
                        <img 
                            className='wall-wallpaper'
                            src={wallpaper || data.wallpaper}
                            alt='wallpaper'
                        />
                        <img 
                            className='wall-avatar'
                            src={avatar || data.avatar}
                            alt='avatar'
                        />
                    </div>
                    <div className='mb-3'>
                        <label className='fw-bold'>
                            Avatar:
                        </label>
                        <div className='row mt-3'>
                            <div className='col-11'>
                                <input
                                    value={avatar}
                                    onChange={handleAvatar}
                                    className='form-control input-mind text'
                                    placeholder='Type link avatar!'
                                />
                            </div>
                            <div className='col-1 d-flex align-items-center m-0 p-0'>
                                <button
                                    onClick={handleDelAvatar}
                                    className='btn-transparent text-danger text-center'
                                >
                                    <AiFillDelete />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='mb-3'>
                        <label className='fw-bold'>
                            Wallpaper:
                        </label>
                        <div className='row mt-3'>
                            <div className='col-11'>
                                <input
                                    value={wallpaper}
                                    onChange={handleWallpaper}
                                    className='form-control input-mind text'
                                    placeholder='Type link wallpaper!'
                                />
                            </div>
                            <div className='col-1 d-flex align-items-center m-0 p-0'>
                                <button
                                    onClick={handleDelWallpaper}
                                    className='btn-transparent text-danger text-center'
                                >
                                    <AiFillDelete />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='mb-3'>
                        <label className='fw-bold'>
                            Name:
                        </label>
                        <input 
                            type='text'
                            className='form-control input-mind text bg'
                            value={name}
                            onChange={handleName}
                            placeholder='Enter name!'
                        />
                    </div>
                    <div className='mb-3'>
                        <label className='fw-bold'>
                            Class:
                        </label>
                        <input 
                            type='text'
                            className='form-control input-mind text bg'
                            value={lop}
                            onChange={handleLop}
                            placeholder='Enter name!'
                        />
                    </div>
                    <div className='mb-3'>
                        <label className='fw-bold'>
                            Faculty:
                        </label>
                        <input 
                            type='text'
                            className='form-control input-mind text bg'
                            value={faculty}
                            onChange={handleFaculty}
                            placeholder='Enter name!'
                        />
                    </div>
                    <div className='mb-3'>
                        <label className='fw-bold'>
                            Description:
                        </label>
                        <TextareaAutosize
                            value={description}
                            onChange={handleDescription}
                            className='form-control text bg-transparent input-mind mt-2'
                            maxRows='7'
                            minRows='5'
                            placeholder='Type description!'
                            style={{resize: 'none'}}
                        />
                    </div>
                    
                    <div className='mb-3'>
                        <label className='fw-bold'>
                            Permission:
                            <span className='text-danger fw-bold'>
                                *
                            </span>
                        </label>
                        <select
                            onChange={handlePer}
                            className='form-select bg input-mind'
                            defaultValue={per}
                        >
                            <option value={2}>Admin</option>
                            <option value={1}>Manager</option>
                            <option value={0}>Student</option>
                        </select>
                    </div>

                </Modal.Body>
                <Modal.Footer className='bg'>
                    <button 
                        className={name && avatar && wallpaper ? 'btn btn-success w-100' : 'btn btn-secondary w-100' }
                        disabled={name && avatar && wallpaper ? false : true}
                        onClick={handleUpdate}
                    >Update</button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default UpdateStudent;