import React, { useState } from 'react';
import { CloseButton, Modal } from 'react-bootstrap';
import api from '../../../axios'
import DataTable from 'react-data-table-component';
import { toast } from 'react-toastify';

function Add({ showModal, setShowModal, setData, listDepartment}) {
    const [ name, setName ] = useState('')
    const [ username, SetUsername ] = useState('')
    const [ pass, setPass ] = useState('')
    const [ pass2, setPass2 ] = useState('')
    const [ selectedRows, setSelectedRows ] = useState(false)
    const [ searchText, setSearchText ] = useState('')
    const [ image, setImage ] = useState(null)
    const [ per, setPer ] = useState(10)
    const filteredItems = listDepartment.filter(
		item => item.name.toLowerCase().includes(searchText.toLowerCase())
            || item.sign.toLowerCase().includes(searchText.toLowerCase())
	)

    const handleImage = e => setImage(e.target.files[0])
    const handleShowModal = () => setShowModal(!showModal)
    const handleName = e => setName(e.target.value)
    const handleUsername = e => SetUsername(e.target.value)
    const handlePass = e => setPass(e.target.value)
    const handlePass2 = e => setPass2(e.target.value)
    const handleSearchText = e => setSearchText(e.target.value)
    const handlePickDepartment = selectedRows => setSelectedRows(selectedRows)
    const handlePer = e => setPer(e.target.value)
    const handleCreate = async() => {
        let formData = new FormData()
        formData.append('image', image)
        formData.append('name', name)
        formData.append('username', username)
        formData.append('pass', pass)
        if(selectedRows.selectedRows)
            selectedRows.selectedRows.map(value => formData.append('department', value._id))
        formData.append('per', per)
        await api.post('/admin/users/add', formData ).then(res=>{
            if(res.data.success){
                setData(prev => [res.data.data, ...prev])
                toast.success('Add successful!')
                handleShowModal()
            }else{
                toast.error(res.data.msg)
            }
        })
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
                        Add User
                    </Modal.Title>
                    <CloseButton onClick={handleShowModal} variant={localStorage.getItem('darkTheme') === 'true' ? 'white' : null}/>
                </Modal.Header>
                <Modal.Body className='bg'>
                    <div className='wall-parent'>
                        <img 
                            className='wall-wallpaper'
                            src='https://thietbiketnoi.com/wp-content/uploads/2020/01/tong-hop-hinh-nen-background-vector-designer-dep-do-phan-giai-fhd-2k-4k-moi-nhat-24-scaled.jpg'
                            alt='wallpaper'
                        />
                        <img 
                            className='wall-avatar'
                            src={image ? URL.createObjectURL(image) : process.env.REACT_APP_DEFAULT_AVATAR}
                            alt='avatar'
                        />
                    </div>
                    
                    <div className='mb-3'>
                        <label className='fw-bold'>
                            Avatar:
                        </label>
                        <input
                            id='upload-file-image'
                            className='form-control text bg input-mind'
                            onChange={handleImage}
                            type="file"
                            accept="image/png, image/jpeg, image/jpg"
                        />
                    </div>
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
                            placeholder='Enter name!'
                        />
                    </div>
                    <div className='mb-3'>
                        <label className='fw-bold'>
                            Username:
                            <span className='text-danger fw-bold'>
                                *
                            </span>
                        </label>
                        <input 
                            type='text'
                            className='form-control text bg input-mind'
                            value={username}
                            onChange={handleUsername}
                            placeholder='Enter name!'
                        />
                    </div>
                    <div className='mb-3'>
                        <label className='fw-bold'>
                            Password:
                            <span className='text-danger fw-bold'>
                                *
                            </span>
                        </label>
                        <input 
                            type='password'
                            className='form-control text bg input-mind'
                            value={pass}
                            onChange={handlePass}
                            placeholder='Enter password!'
                        />
                        {pass && pass.length < 4 && (
                            <label className='text-small text-danger d-flex justify-content-end'>At least 4 character!</label>
                        )}
                    </div>
                    <div className='mb-3'>
                        <label className='fw-bold'>
                            Password again:
                            <span className='text-danger fw-bold'>
                                *
                            </span>
                        </label>
                        <input 
                            type='password'
                            className='form-control text bg input-mind'
                            value={pass2}
                            onChange={handlePass2}
                            placeholder='Enter password again!'
                        />
                        {pass && pass2 && pass !== pass2 && (
                            <label className='text-small text-danger d-flex justify-content-end'>Not match!</label>
                        )}
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
                        >
                            <option value={2}>Admin</option>
                            <option value={1}>Manager</option>
                        </select>
                    </div>
                    <div className='mb-3'>
                        <div className='d-flex justify-content-between'>
                            <label className='fw-bold'>Department permission: </label>
                            <div>
                                <input
                                    className='form-control input-mind bg-light text'
                                    type="text"
                                    placeholder="Filter By Name | Sign"
                                    aria-label="Search Input"
                                    onChange={handleSearchText}
                                    value={searchText}
                                />
                            </div>
                        </div>
                        
                        <DataTable
                            columns={[
                                {
                                    name: 'Name',
                                    selector: row => row.name,
                                    sortable: true,
                                },
                                {
                                    name: 'Sign',
                                    selector: row => row.sign,
                                    sortable: true,
                                },
                                {
                                    name: 'CreateAt',
                                    selector: row => new Date(row.createdAt).toLocaleString("en-US"),
                                    sortable: true,
                                },
                            ]}
                            data={filteredItems}
                            pagination
                            fixedHeader
                            selectableRows
                            onSelectedRowsChange={handlePickDepartment}
                            theme={localStorage.getItem('darkTheme') === 'true' ? 'dark' : 'default'}
                            
                        />
                    </div>

                </Modal.Body>
                <Modal.Footer className='bg'>
                    <button 
                        className={name && username && pass && pass2 && pass.length >= 4 && pass === pass2 ? 'btn btn-success w-100' : 'btn btn-secondary w-100' }
                        disabled={name && username && pass && pass2 && pass.length >= 4 && pass === pass2 ? false : true}
                        onClick={handleCreate}
                    >Add</button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Add;