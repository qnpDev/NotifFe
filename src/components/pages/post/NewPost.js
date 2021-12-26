import React, { useEffect, useRef, useState, useContext } from 'react';
import { toast } from 'react-toastify';
import api from '../../axios'

//Icons
import { 
    MdLiveTv,
    MdOutlinePhotoLibrary,
    MdDelete,
} from 'react-icons/md'
import { CgSmileMouthOpen } from 'react-icons/cg'
import { BiX, BiSend } from 'react-icons/bi'
import { CloseButton, Modal } from 'react-bootstrap';
import TextareaAutosize from 'react-textarea-autosize';
import ReactPlayer from 'react-player';
import { IoContext } from '../../contexts/IoContext';

const NewPost = ( { user, setPost, realtime }) => {
    const [showModal, setShowModal] = useState(false)
    const [text, setText] = useState('')
    const [image, setImage] = useState(null)
    const [btnVideo, setBtnVideo] = useState(false)
    const [inputYoutube, setInputYoutube] = useState('')
    const [linkYoutube, setLinkYoutube] = useState('')
    const textRef = useRef()
    const fileImageRef = useRef()
    const inputYoutubeRef = useRef()
    const { socket } = useContext(IoContext)
    const [loading, setLoading] = useState(false)

    const handleText = e =>{
        setText(e.target.value)
    }
    const handleImage = e =>{
        let file = image ? [...image] : []
        let files = [...e.target.files]
        files.map(value => 
            file = [...file, value]
        )
        // const file = URL.createObjectURL(e.target.files[0])
        setImage(file)
    }
    const handleShowModal = () => setShowModal(!showModal)
    const handleBtnVideo = () => setBtnVideo(!btnVideo)
    const handleImageDelete = e => setImage(image.filter((value, index)=>index!==e))
    const handleInputYoutube = e => setInputYoutube(e.target.value)
    const handleLinkYoutube = () => {
        setLinkYoutube(inputYoutube) 
        handleBtnVideo()
    }
    const handleLinkYoutubeDel = () => {
        setLinkYoutube('')
        setInputYoutube('')
        inputYoutubeRef.current && inputYoutubeRef.current.focus()
    }
    const handleNewPost = async () => {
        setLoading(true)
        let formData = new FormData()
        if (image)
            image.map(value => 
                formData.append('imgCollection', value)
            )
        formData.append('text', text)
        formData.append('video', linkYoutube)

        toast.promise(new Promise((resolve, reject) => {
            api.post('/post/new', formData ).then(res=>{
                if (res.data.success){
                    handleShowModal()
                    if(!realtime)
                        setPost(prev => [ res.data.data , ...prev])
                    setText('')
                    setImage(null)
                    setInputYoutube('')
                    setLinkYoutube('')
                    setLoading(false)
                    resolve()
                }else{
                    toast.error(res.data.msg)
                    setLoading(false)
                    reject()
                }
            })

        }), {
            pending: 'Wait...',
            success: 'Post successful!',
            error: 'Post error!'
        })
    }

    useEffect(() => (textRef.current && textRef.current.focus()) , [showModal])
    useEffect(() => (fileImageRef.current ? fileImageRef.current.value = null : null), [image])
    useEffect(() => (inputYoutubeRef.current && inputYoutubeRef.current.focus()),[btnVideo])
    useEffect(() => {
        if(realtime)
            socket.on('postNew', res => {
                setPost(prev => [res, ...prev])
            })
        return () => socket.off('postNew')
    }, [ socket, setPost, realtime ])
    return (
        <>
        <div className='card mb-3'>
            <div className='card-body'>
                <div className='row mb-2'>
                    <div className='col-1 mini-dp'>
                        <div className='h-100 w-100 d-flex justify-content-center align-items-center'>
                            <div className='header_img'> 
                                <img src={user.avatar} alt=''/> 
                            </div>
                        </div>
                    </div>
                    <div className='col-11 mini-dp-except'>
                        <div className='input-group'>
                            <button className='btn-transparent m-0 p-0 w-100 cursor-pointer' onClick={handleShowModal}>
                            <input
                                value={text}
                                onChange={handleShowModal}
                                disabled
                                onClick={handleShowModal}
                                className='form-control input-mind bg-light cursor-pointer'
                                placeholder={"What's on your mind! " + user.name.split(' ')[user.name.split(' ').length - 1]}
                            /></button>
                        </div>
                    </div>
                </div>
                <div className='row pt-2 text-center border-top'>
                    <div className='col-4'>
                        <button onClick={handleShowModal} className='post-btn'>
                            <span className='text-danger'><MdLiveTv/></span>
                            <span> Video</span>
                        </button>
                    </div>
                    <div className='col-4'>
                        <button onClick={handleShowModal} className='post-btn'>
                            <span className='text-success'><MdOutlinePhotoLibrary/></span>
                            <span> Photo</span>
                        </button>
                    </div>
                    <div className='col-4'>
                        <button onClick={handleShowModal} className='post-btn'>
                            <span className='text-warning'><CgSmileMouthOpen/></span>
                            <span> Feel</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <Modal 
            show={showModal}
            size='lg' 
            centered
            onHide={handleShowModal}
        >
            <Modal.Header className='d-flex justify-content-center bg'>
                <Modal.Title id="contained-modal-title-vcenter">
                    New Post
                </Modal.Title>
                <CloseButton onClick={handleShowModal} variant={localStorage.getItem('darkTheme') === 'true' ? 'white' : null}/>
            </Modal.Header>
            <Modal.Body className='bg'>
                <TextareaAutosize
                    ref={textRef}
                    value={text}
                    onChange={handleText}
                    className='form-control text bg-transparent border-0'
                    maxRows='7'
                    minRows='5'
                    placeholder={"What's on your mind, " + user.name.split(' ')[user.name.split(' ').length - 1] + '!'}
                    style={{resize: 'none'}}
                />
                {image && (
                    <div className='mt-3 d-flex flex-wrap justify-content-center'>
                        {image.map((value, index)=> (
                            <div key={index} className="newpost-img-wraps">
                                <span onClick={() => handleImageDelete(index)} className="newpost-closes" title="Delete">
                                    <BiX/>
                                </span>
                                <img className='newpost-img border' src={(URL.createObjectURL(value))} alt='previewImage'/>
                            </div>
                        ))}
                    </div>
                )}
                {linkYoutube && (
                    <div className='mt-3 d-flex flex-wrap justify-content-center'>
                        <ReactPlayer 
                            url={linkYoutube}
                            controls={true}
                        />
                    </div>
                )}
                <div className='row p-2 text-center'>
                    <div className='col-4'>
                        <button onClick={handleBtnVideo} className='post-btn btn-transparent'>
                            <span className='text-danger'><MdLiveTv/></span>
                            <span> Video</span>
                        </button>
                    </div>
                    <div className='col-4'>
                        <input
                            ref={fileImageRef}
                            id='upload-file-image'
                            onChange={handleImage}
                            type="file"
                            style={{ display: "none" }}
                            multiple={true}
                            accept="image/png, image/jpeg, image/jpg"
                        />
                        <button className='post-btn btn-transparent'>
                            <label className='label-click' htmlFor='upload-file-image'>
                                <span className='text-success'><MdOutlinePhotoLibrary/></span>
                                <span> Photo</span>
                            </label>
                        </button>
                    </div>
                    <div className='col-4'>
                        <button className='post-btn btn-transparent'>
                           <span className='text-warning'><CgSmileMouthOpen/></span>
                            <span> Feel</span>
                        </button>
                    </div>
                </div>
                {btnVideo && (
                    <div className='mt-3 row'>
                        <div className='col-11'>
                            <input 
                                ref={inputYoutubeRef}
                                value={inputYoutube}
                                onChange={handleInputYoutube}
                                className='form-control input-mind bg-transparent text'
                                placeholder='Link video Youtube'
                            />
                        </div>
                        <div className='col-1 m-0 p-0 d-flex align-items-center justify-content-center'>
                            {inputYoutube && (
                                <button 
                                    onClick={handleLinkYoutubeDel}
                                    className='btn-transparent bg-white text-danger text-center'
                                >
                                    <MdDelete/>
                                </button>
                            )}
                            <button 
                                onClick={handleLinkYoutube}
                                className='btn-transparent text-primary text-center'
                            >
                                <BiSend/>
                            </button>
                        </div>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer className='bg'>
                <button 
                    className={(text || image || linkYoutube) && !loading ? 'btn btn-primary w-100' : 'btn btn-secondary w-100' }
                    onClick={handleNewPost}
                    disabled={(text || image || linkYoutube) && !loading ? false : true}
                >Post</button>
            </Modal.Footer>
        </Modal>
        </>
    );
};

export default React.memo(NewPost);