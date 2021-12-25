import React, { useEffect, useRef, useState } from 'react';
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
import { toast } from 'react-toastify';


function PostEdit ({show, handleEdit, data, setData}){
    const [text, setText] = useState(data.text)
    const [image, setImage] = useState(data.img)
    const [imageNew, setImageNew] = useState(null)
    const [imageDel, setImageDel] = useState([])
    const [btnVideo, setBtnVideo] = useState(false)
    const [inputYoutube, setInputYoutube] = useState(data.video)
    const [linkYoutube, setLinkYoutube] = useState(data.video)
    const textRef = useRef()
    const fileImageRef = useRef()
    const inputYoutubeRef = useRef()

    const handleText = e =>{
        setText(e.target.value)
    }
    const handleImage = e =>{
        let file = imageNew ? [...imageNew] : []
        let files = [...e.target.files]
        files.map(value => 
            file = [...file, value]
        )
        setImageNew(file)
    }
    const handleBtnVideo = () => setBtnVideo(!btnVideo)
    const handleImageDelete = e => {
        setImageDel(prev => [...prev, e])
        setImage(image.filter(value=>value!==e))
    }
    const handleImageDeleteNew = e => setImageNew(imageNew.filter((value, index)=>index!==e))
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
    const handleUpdate = () => {
        let formData = new FormData()
        if (imageNew)
            imageNew.map(value => 
                formData.append('imgCollection', value)
            )
        if (imageDel)
            imageDel.map(value => 
                formData.append('imgDel', value)
            )
        if (image)
            image.map(value => 
                formData.append('imgOld', value)
            )
        formData.append('id', data._id)
        formData.append('text', text)
        formData.append('video', linkYoutube)

        toast.promise(new Promise((resolve, reject) => {
            api.post('/post/edit', formData )
            .then(res => {
                if (res.data.success){
                    resolve()
                }else{
                    toast.error(res.data.msg)
                    reject()
                }
            })

        }), {
            pending: 'Wait...',
            success: 'Update successful!',
            error: 'Somethings wrong!'
        })
        
        // api.post('/post/edit', formData )
        // .then(res => {
        //     if (res.data.success){
        //         toast.success('Update successfully!')
        //         // setData({
        //         //     ...data,
        //         //     img: image,
        //         //     text,
        //         //     video: linkYoutube
        //         // })
        //     }else{
        //         toast.error(res.data.msg)
        //     }
        // })
        handleEdit()
    }
    useEffect(() => (textRef.current && textRef.current.focus()) , [])
    useEffect(() => (fileImageRef.current ? fileImageRef.current.value = null : null), [image])
    useEffect(() => (inputYoutubeRef.current && inputYoutubeRef.current.focus()),[btnVideo])
    
    return (
        <Modal 
        show={show}
        size='lg' 
        centered
        onHide={handleEdit}
        >
        <Modal.Header className='d-flex justify-content-center bg'>
            <Modal.Title id="contained-modal-title-vcenter">
                Edit Post
            </Modal.Title>
            <CloseButton onClick={handleEdit} variant={localStorage.getItem('darkTheme') === 'true' ? 'white' : null}/>
        </Modal.Header>
        <Modal.Body className='bg'>
            <TextareaAutosize
                ref={textRef}
                value={text}
                onChange={handleText}
                className='form-control text bg-transparent border-0'
                maxRows='7'
                minRows='5'
                placeholder="What's on your mind, Q"
                style={{resize: 'none'}}
            />
            <div className='mt-3 d-flex flex-wrap justify-content-center'>
            {image && 
                    image.map((value, index)=> (
                        <div key={index} className="newpost-img-wraps">
                            <span onClick={() => handleImageDelete(value)} className="newpost-closes" title="Delete">
                                <BiX/>
                            </span>
                            <img className='newpost-img' src={value} alt='previewImage'/>
                        </div>
                    ))
            }
            {imageNew && 
                    imageNew.map((value, index)=> (
                        <div key={index} className="newpost-img-wraps">
                            <span onClick={() => handleImageDeleteNew(index)} className="newpost-closes" title="Delete">
                                <BiX/>
                            </span>
                            <img className='newpost-img' src={(URL.createObjectURL(value))} alt='previewImage'/>
                        </div>
                    ))
                    }
            </div>
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
                        <span> Felling</span>
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
                            className='form-control input-mind bg-transparent'
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
                            className='btn-transparent bg-white text-primary text-center'
                        >
                            <BiSend/>
                        </button>
                    </div>
                </div>
            )}
        </Modal.Body>
        <Modal.Footer className='bg'>
            <button 
                className={(text || image || linkYoutube) ? 'btn btn-primary w-100' : 'btn btn-secondary w-100' }
                onClick={handleUpdate}
                disabled={(text || image || linkYoutube) ? false : true}
            >Update</button>
        </Modal.Footer>
        </Modal>
    );
};

export default PostEdit;