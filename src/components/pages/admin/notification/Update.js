import React, { useRef, useState } from 'react';
import { CloseButton, Modal } from 'react-bootstrap';
import api from '../../../axios'
import DataTable from 'react-data-table-component';
import { toast } from 'react-toastify';
// import TextareaAutosize from 'react-textarea-autosize';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

import { IoTrashBinSharp, IoAddCircleSharp } from 'react-icons/io5'
import { ContentState, convertToRaw, EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg'
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';

function Update({ close, data, setList, listDepartment }) {

    const [ name, setName ] = useState(data.name)
    const [ content, setContent ] = useState(data.content)
    const [ selectedRows, setSelectedRows ] = useState(data.department ? listDepartment.filter(value => data.department.includes(value._id)) : [])
    const [ NotelectedRows, setNotSelectedRows ] = useState(data.department ? listDepartment.filter(value => !data.department.includes(value._id)) : listDepartment)
    const [ searchText, setSearchText ] = useState('')
    const [ searchTextNot, setSearchTextNot ] = useState('')
    const [ important, setImportant ] = useState(data.important)
    const [ dataFile, setDataFile ] = useState(data.file)
    const [ dataFileDel, setDataFileDel ] = useState([])
    const [ files, setFiles ] = useState()
    const refFiles = useRef()

    const { contentBlocks, entityMap } = htmlToDraft(data.content)
    const [ contentText, setContentText ] = useState(EditorState.createWithContent(ContentState.createFromBlockArray(contentBlocks, entityMap)))

    const filteredItems = selectedRows && selectedRows.filter(
		item => item.name.toLowerCase().includes(searchText.toLowerCase())
            || item.sign.toLowerCase().includes(searchText.toLowerCase())
	)
    const filteredNotItems = NotelectedRows && NotelectedRows.filter(
		item => item.name.toLowerCase().includes(searchTextNot.toLowerCase())
            || item.sign.toLowerCase().includes(searchTextNot.toLowerCase())
	)
    const handleAddD = e => {
        setSelectedRows(prev => [e, ...prev])
        setNotSelectedRows(prev => prev.filter(value => value._id !== e._id))
    }
    const handleRemoveD = e => {
        setNotSelectedRows(prev => [e, ...prev])
        setSelectedRows(prev => prev.filter(value => value._id !== e._id))
    }
    
    const handleFileDel = e => {
        setDataFileDel(prev => [...prev, e])
        setDataFile(dataFile.filter(value=>value!==e))
    }
    const handleSearchTextNot = e => setSearchTextNot(e.target.value)
    const handleName = e => setName(e.target.value)
    // const handleContent = e => setContent(e.target.value)
    const handleContent = e => {
        setContentText(e)
        setContent(draftToHtml(convertToRaw(e.getCurrentContent())))
    }
    const handleSearchText = e => setSearchText(e.target.value)
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

    const handleUpdate = () => {
        let formData = new FormData()
        formData.append('notifId', data._id)
        formData.append('name', name)
        formData.append('content', content)
        formData.append('important', important)
        formData.append('fileDel', dataFileDel)
        formData.append('fileOld', dataFile)
        if(selectedRows)
            selectedRows.map(value => formData.append('department', value._id))
        if(files)
            files.map(value => formData.append('files', value))
        api.post('/manager/edit', formData ).then(res=>{
            if(res.data.success){
                setList(prev => prev.map(value =>
                    value._id === data._id
                        ? res.data.data
                        : value
                ))
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
                        Update Notification
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
                            className='form-control text bg input-mind'
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
                        {/* <TextareaAutosize
                            value={content}
                            onChange={handleContent}
                            className='form-control text bg'
                            maxRows='14'
                            minRows='5'
                            placeholder="What's content!"
                            style={{resize: 'none'}}
                            /> */}

                        <Editor 
                            editorState={contentText}
                            onEditorStateChange={handleContent}
                            wrapperClassName="form-control text bg input-mind richtext-wrapper"
                            editorClassName="richtext-editor p-2"
                            toolbarClassName="richtext-toolbar"
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
                            className='form-select bg input-mind'
                            defaultValue={important}
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
                            {dataFile && dataFile.map(value => (
                                <li key={value} className='list-group-item bg input-mind'>
                                    <div className='d-flex justify-content-between'>
                                        <div>{value.split('/')[value.split('/').length - 1]}</div>
                                        <div 
                                            onClick={() => handleFileDel(value)}
                                            className='text-danger cursor-pointer'
                                        ><IoTrashBinSharp/></div>
                                    </div>    
                                </li>
                            ))}
                        </ul>
                        <ul className='list-group'>
                            {files && files.map((value, index) => (
                                <li key={index} className='list-group-item bg input-mind'>
                                    <div className='d-flex justify-content-between'>
                                        <div>{value.name || value}</div>
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
                            className='form-control text bg input-mind'
                            multiple
                            onChange={handleFiles}
                        />
                        <div className='d-flex justify-content-end text-small'>You can select multiple files!</div>
                    </div>
                    <div className='mb-3'>
                        <div className='d-flex justify-content-between'>
                            <label className='fw-bold'>Department choosed: </label>
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
                                            onClick={()=> handleRemoveD(row)}
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
                            <label className='fw-bold'>Department not choose: </label>
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
                                            onClick={()=> handleAddD(row)}
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
                        className={name && content && selectedRows && selectedRows.length !== 0 ? 'btn btn-success w-100' : 'btn btn-secondary w-100' }
                        disabled={name && content && selectedRows && selectedRows.length !== 0 ? false : true}
                        onClick={handleUpdate}
                    >Update</button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Update;