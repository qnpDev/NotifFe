import React, { useState } from 'react';
import { CloseButton, Modal } from 'react-bootstrap';
import api from '../../../axios'
import DataTable from 'react-data-table-component';
import { toast } from 'react-toastify';
import { AiFillDelete } from 'react-icons/ai'

import { IoTrashBinSharp, IoAddCircleSharp } from 'react-icons/io5'

function Update({ close, data, setList, listDepartment }) {
    const [ name, setName ] = useState(data.name)
    const [ username, setUsername ] = useState(data.per.username)
    const [ pass, setPass ] = useState('')
    const [ pass2, setPass2 ] = useState('')
    const [ selectedRows, setSelectedRows ] = useState(data.per.department ? listDepartment.filter(value => data.per.department.includes(value._id)) : [])
    const [ NotelectedRows, setNotSelectedRows ] = useState(data.per.department ? listDepartment.filter(value => !data.per.department.includes(value._id)) : listDepartment)
    const [ searchText, setSearchText ] = useState('')
    const [ searchTextNot, setSearchTextNot ] = useState('')
    const [ image, setImage ] = useState(null)
    const [ per, setPer ] = useState(data.per.permission)
    const [ wallpaper, setWallpaper ] = useState(data.wallpaper)
    const filteredItems = selectedRows && selectedRows.filter(
		item => item.name.toLowerCase().includes(searchText.toLowerCase())
            || item.sign.toLowerCase().includes(searchText.toLowerCase())
	)
    const filteredNotItems =  NotelectedRows.filter(
		item => item.name.toLowerCase().includes(searchTextNot.toLowerCase())
            || item.sign.toLowerCase().includes(searchTextNot.toLowerCase())
	)

    const handleImage = e => setImage(e.target.files[0])
    const handleName = e => setName(e.target.value)
    const handleUsername = e => setUsername(e.target.value)
    const handlePass = e => setPass(e.target.value)
    const handlePass2 = e => setPass2(e.target.value)
    const handleSearchText = e => setSearchText(e.target.value)
    const handleSearchTextNot = e => setSearchTextNot(e.target.value)
    const handleWallpaper = e => setWallpaper(e.target.value)
    const handleAddPer = e => {
        setSelectedRows(prev => [e, ...prev])
        setNotSelectedRows(prev => prev.filter(value => value._id !== e._id))
    }
    const handleRemovePer = e => {
        setNotSelectedRows(prev => [e, ...prev])
        setSelectedRows(prev => prev.filter(value => value._id !== e._id))
    }
    const handlePer = e => setPer(e.target.value)
    const handleDelWallpaper = () => setWallpaper('')
    const handleUpdate = async() => {
        let formData = new FormData()
        formData.append('id', data._id)
        formData.append('image', image)
        formData.append('name', name)
        formData.append('username', username)
        formData.append('pass', pass)
        formData.append('wallpaper', wallpaper)
        if(selectedRows)
            selectedRows.map(value => formData.append('department', value._id))
        formData.append('permission', per)
        await api.post('/admin/users/edit', formData ).then(res=>{
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
                        Update User
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
                            src={image ? URL.createObjectURL(image) : data.avatar}
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
                            <span className='text-danger fw-bold '>
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
                            defaultValue={per}
                        >
                            <option value={2}>Admin</option>
                            <option value={1}>Manager</option>
                            <option value={0}>Student</option>
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
                                    name: 'Action',
                                    selector: row => (
                                        <button 
                                            onClick={()=> handleRemovePer(row)}
                                            className='btn btn-transparent text-danger m-1 p-0'>
                                            <IoTrashBinSharp/>
                                        </button>
                                    )
                                },                             
                            ]}
                            data={filteredItems}
                            pagination
                            fixedHeader
                            theme={localStorage.getItem('darkTheme') === 'true' ? 'dark' : 'default'}
                        />
                    </div>
                    <div className='mb-3'>
                        <div className='d-flex justify-content-between'>
                            <label className='fw-bold'>Department not permission: </label>
                            <div>
                                <input
                                    className='form-control input-mind bg-light text'
                                    type="text"
                                    placeholder="Filter By Name | Sign"
                                    aria-label="Search Input"
                                    onChange={handleSearchTextNot}
                                    value={searchTextNot}
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
                                    name: 'Action',
                                    selector: row => (
                                        <button 
                                            onClick={()=> handleAddPer(row)}
                                            className='btn btn-transparent text-success m-1 p-0'>
                                            <IoAddCircleSharp/>
                                        </button>
                                    )
                                },     
                            ]}
                            data={filteredNotItems}
                            pagination
                            fixedHeader
                            theme={localStorage.getItem('darkTheme') === 'true' ? 'dark' : 'default'}
                        />
                    </div>

                </Modal.Body>
                <Modal.Footer className='bg'>
                    <button 
                        className={name ? 'btn btn-success w-100' : 'btn btn-secondary w-100' }
                        disabled={name ? false : true}
                        onClick={handleUpdate}
                    >Update</button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Update;