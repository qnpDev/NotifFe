import React, { useEffect, useRef, useState } from 'react';
import { CloseButton, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../../axios'
import { AiFillDelete } from 'react-icons/ai'
function EditWallpaper({ close, data, setData }) {

    const [ wall, setWall ] = useState(data.wallpaper)
    const inputRef = useRef()

    const handleWall = e => setWall(e.target.value)
    const handleUpdate = () => {
        api.post('/user/editWallpaper', {
            userId: data.id,
            wallpaper: wall,
        }).then(res => {
            if(res.data.success){
                toast.success(res.data.msg)
                setData(wall)
                close()
            }else
                toast.error(res.data.msg)
        })
    }
    const handleDel = () => { 
        setWall('')
        inputRef.current.focus()
    }
    useEffect(() => {
        inputRef.current.focus()
    }, [])
    
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
                        Wallpaper
                    </Modal.Title>
                    <CloseButton onClick={close} variant={localStorage.getItem('darkTheme') === 'true' ? 'white' : null}/>
                </Modal.Header>
                <Modal.Body className='bg'>
                    <div className='text fw-bold'>
                        Input link wallpaper:
                    </div>
                    <div className='row mt-3'>
                        <div className='col-11'>
                            <input
                                ref={inputRef}
                                value={wall}
                                onChange={handleWall}
                                className='form-control input-mind text'
                                placeholder='Type your link Wallpaper!'
                            />
                        </div>
                        <div className='col-1 d-flex align-items-center m-0 p-0'>
                            <button
                                onClick={handleDel}
                                className='btn-transparent text-danger text-center'
                            >
                                <AiFillDelete />
                            </button>
                        </div>
                    </div>
                    
                </Modal.Body>
                <Modal.Footer className='bg'>
                    <button
                        className={wall ? 'btn btn-success w-100' : 'btn btn-secondary w-100' }
                        disabled={wall ? false : true}
                        onClick={handleUpdate}
                    >Update</button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default EditWallpaper;