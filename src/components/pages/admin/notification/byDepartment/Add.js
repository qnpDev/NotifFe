import React, { useRef, useState } from 'react';
import { CloseButton, Modal } from 'react-bootstrap';
import api from '../../../../axios'
import { toast } from 'react-toastify';
// import TextareaAutosize from 'react-textarea-autosize';

import { IoTrashBinSharp } from 'react-icons/io5'

import { convertToRaw, EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html';

function Add({ close, setList, idDepartment }) {

    const [ name, setName ] = useState('')
    const [ content, setContent ] = useState('')
    const [ important, setImportant ] = useState(false)
    const [ files, setFiles ] = useState()
    const refFiles = useRef()
    const [ contentText, setContentText ] = useState(() => EditorState.createEmpty())

    const handleName = e => setName(e.target.value)
    // const handleContent = e => setContent(e.target.value)
    const handleContent = e => {
        setContentText(e)
        setContent(draftToHtml(convertToRaw(e.getCurrentContent())))
    }
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

    const handleAdd = () => {
        let formData = new FormData()
        formData.append('name', name)
        formData.append('content', content)
        formData.append('important', important)
        formData.append('department', idDepartment)
        if(files)
            files.map(value => formData.append('files', value))
        toast.promise(new Promise((resolve, reject) => {
            api.post('/manager/add', formData ).then(res=>{
                if (res.data.success){
                    setList(prev => [res.data.data, ...prev])
                    close()
                    resolve()
                }else{
                    reject()
                }
            })

        }), {
            pending: 'Wait...',
            success: 'Add successful!',
            error: 'Add error!'
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
                                <li key={index} className='list-group-item bg input-mind'>
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
                            className='form-control text bg input-mind'
                            multiple
                            onChange={handleFiles}
                        />
                        <div className='d-flex justify-content-end text-small'>You can select multiple files!</div>
                    </div>
                    

                </Modal.Body>
                <Modal.Footer className='bg'>
                    <button 
                        className={name && content ? 'btn btn-success w-100' : 'btn btn-secondary w-100' }
                        disabled={name && content? false : true}
                        onClick={handleAdd}
                    >Add</button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Add;