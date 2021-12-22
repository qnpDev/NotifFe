import React, { useState } from 'react';
import api from '../../../axios'
import { toast } from 'react-toastify';
import { CloseButton, Modal } from 'react-bootstrap';

function Add({ showModal, setShowModal, setData}) {
    const [ name, setName ] = useState('')
    const [ sign, setSign ] = useState('')
    const [ image, setImage ] = useState(null)
    const handleShowModal = () => setShowModal(!showModal)
    const handleName = e => setName(e.target.value)
    const handleSign = e => setSign(e.target.value)
    const handleImage = e => setImage(e.target.files[0])
    const handleCreate = async() => {
        if (name === '' || sign === '')
            toast.error('Enter department name!')
        else{
            let formData = new FormData()
            formData.append('image', image)
            formData.append('name', name)
            formData.append('sign', sign)
            await api.post('/admin/department/add', formData ).then(res=>{
                if(res.data.success){
                    setData(prev => [res.data.data, ...prev])
                    toast.success('Add successful!')
                    handleShowModal()
                }else{
                    toast.error(res.data.msg)
                }
            })
        }
    }
    return (
        <>
            <Modal 
                show={showModal}
                size='lg' 
                centered
                onHide={handleShowModal}
            >
                <Modal.Header className='d-flex justify-content-center bg'>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Add Department
                    </Modal.Title>
                    <CloseButton onClick={handleShowModal} variant={localStorage.getItem('darkTheme') === 'true' ? 'white' : null}/>
                </Modal.Header>
                <Modal.Body className='bg'>
                    <div className='mb-3 text-center'>
                        <img className='user-avatar'
                            src={image ? URL.createObjectURL(image) : process.env.REACT_APP_DEFAULT_AVATAR}
                            alt='avatar'/>
                        <br/>
                        <input
                            id='upload-file-image'
                            onChange={handleImage}
                            type="file"
                            accept="image/png, image/jpeg, image/jpg"
                        />
                    </div>
                    <label className='fw-bold'>Name: </label>
                    <input 
                        type='text'
                        className='form-control text bg mb-3'
                        value={name}
                        onChange={handleName}
                        placeholder='Enter department name!'
                    />
                    <label className='fw-bold'>Sign: </label>
                    <input 
                        type='text'
                        className='form-control text bg'
                        value={sign}
                        onChange={handleSign}
                        placeholder='Enter department sign!'
                    />
                </Modal.Body>
                <Modal.Footer className='bg'>
                    <button 
                        className={name && sign ? 'btn btn-success w-100' : 'btn btn-secondary w-100' }
                        disabled={name && sign ? false : true}
                        onClick={handleCreate}
                    >Add</button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Add;