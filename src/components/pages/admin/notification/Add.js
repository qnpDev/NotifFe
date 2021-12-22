import React, { useRef, useState } from 'react';
import { CloseButton, Modal } from 'react-bootstrap';
import api from '../../../axios'
import DataTable from 'react-data-table-component';
import { toast } from 'react-toastify';
import TextareaAutosize from 'react-textarea-autosize';

import { IoTrashBinSharp } from 'react-icons/io5'

function Add({ close, setList, listDepartment }) {

    const [ name, setName ] = useState('')
    const [ content, setContent ] = useState('')
    const [ selectedRows, setSelectedRows ] = useState()
    const [ searchText, setSearchText ] = useState('')
    const [ important, setImportant ] = useState(false)
    const [ files, setFiles ] = useState()
    const refFiles = useRef()

    const filteredItems = listDepartment && listDepartment.filter(
		item => item.name.toLowerCase().includes(searchText.toLowerCase())
            || item.sign.toLowerCase().includes(searchText.toLowerCase())
	)

    const handleName = e => setName(e.target.value)
    const handleContent = e => setContent(e.target.value)
    const handleSearchText = e => setSearchText(e.target.value)
    const handlePickDepartment = selectedRows => setSelectedRows(selectedRows.selectedRows)
    const handleImportant = e => setImportant(e.target.value)
    const handleFiles = e =>{
        let file = files ? [...files] : []
        let upFiles = [...e.target.files]
        upFiles.map(value => 
            file = [...file, value]
        )
        setFiles(file)
        refFiles.current.value = null
    }
    const handleDeleteFile = e => 
        setFiles(prev => prev.filter((value, index) => index !== e))

    const handleAdd = async() => {
        let formData = new FormData()
        formData.append('name', name)
        formData.append('content', content)
        formData.append('important', important)
        if(selectedRows)
            selectedRows.map(value => formData.append('department', value._id))
        if(files)
            files.map(value => formData.append('files', value))
        await api.post('/manager/add', formData ).then(res=>{
            if(res.data.success){
                setList(prev => [res.data.data, ...prev])
                toast.success('Add successful!')
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
                        Add Notification
                    </Modal.Title>
                    <CloseButton onClick={close} variant={localStorage.getItem('darkTheme') === 'true' ? 'white' : null}/>
                </Modal.Header>
                <Modal.Body className='bg'>
                    <div className='mb-3'>
                        <label className='fw-bold'>
                            Title:
                            <span className='text-danger fw-bold'>
                                *
                            </span>
                        </label>
                        <input 
                            type='text'
                            className='form-control text bg'
                            value={name}
                            onChange={handleName}
                            placeholder='Enter name!'
                        />
                    </div>
                    <div className='mb-3'>
                    <   label className='fw-bold'>
                            Content:
                            <span className='text-danger fw-bold'>
                                *
                            </span>
                        </label>
                        <TextareaAutosize
                            value={content}
                            onChange={handleContent}
                            className='form-control text bg'
                            maxRows='14'
                            minRows='5'
                            placeholder="What's content!"
                            style={{resize: 'none'}}
                            />
                    </div>
                    <div className='input-group mb-3'>
                        <label className='input-group-text fw-bold bg border-0'>
                            Important:
                            <span className='text-danger fw-bold'>
                                *
                            </span>
                        </label>
                        <select
                            onChange={handleImportant}
                            className='form-select bg'
                        >
                            <option value={false}>No</option>
                            <option value={true}>Yes</option>
                        </select>
                    </div>
                    <div className='mb-3'>
                        <label className='fw-bold'>
                            Files:
                        </label>
                        <ul className='list-group'>
                            {files && files.map((value, index) => (
                                <li key={index} className='list-group-item bg'>
                                    <div className='d-flex justify-content-between'>
                                        <div>{value.name}</div>
                                        <div 
                                            onClick={() => handleDeleteFile(index)}
                                            className='text-danger cursor-pointer'
                                        ><IoTrashBinSharp/></div>
                                    </div>    
                                </li>
                            ))}
                        </ul>
                        <input 
                            ref={refFiles}
                            type='file'
                            className='form-control text bg'
                            multiple
                            onChange={handleFiles}
                        />
                        <div className='d-flex justify-content-end text-small'>You can select multiple files!</div>
                    </div>
                    <div className='mb-3'>
                        <div className='d-flex justify-content-between'>
                            <label className='fw-bold'>Department: </label>
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
                        className={name && content && selectedRows && selectedRows.length !== 0 ? 'btn btn-success w-100' : 'btn btn-secondary w-100' }
                        disabled={name && content && selectedRows && selectedRows.length !== 0 ? false : true}
                        onClick={handleAdd}
                    >Add</button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Add;