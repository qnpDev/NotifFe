import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../../axios'

function Update({ close, data, setList }) {
    const [ name, setName ] = useState(data.name)
    const [ sign, setSign ] = useState(data.sign)
    const [ image, setImage ] = useState()

    const handleName = e => setName(e.target.value)
    const handleSign = e => setSign(e.target.value)
    const handleImage = e => setImage(e.target.files[0])
    const handleUpdate = async () => {
        if (name === '' || sign === '')
            toast.error('Please fill all value!')
        else{
            let formData = new FormData()
            formData.append('image', image)
            formData.append('name', name)
            formData.append('sign', sign)
            formData.append('id', data._id)
            await api.post('/admin/department/edit', formData ).then(res=>{
                if(res.data.success){
                    toast.success('Update successfull!')
                    setList(prev => prev.map(value => 
                        value._id === data._id
                            ? res.data.data
                            : value ))
                    close()
                }else{
                    toast.error(res.data.msg)
                }
            })
        }
    }

    return (
        <>
            <div className='card'>
                <div className='card-header text-center'>
                    <h1>Update</h1>
                </div>
                <div className='card-body'>
                    <div className='mb-3 text-center'>
                        <img className='user-avatar'
                            src={image ? URL.createObjectURL(image) : data.avatar}
                            alt='avatar'/>
                        <br/>
                        <input
                            id='upload-file-image'
                            onChange={handleImage}
                            type="file"
                            accept="image/png, image/jpeg, image/jpg"
                        />
                    </div>
                    <p>
                        <b>Name: </b>
                        <br/>
                        <input 
                            className='form-control text bg mb-3'
                            type='text'
                            value={name}
                            onChange={handleName}
                            placeholder='Enter department name!'
                        />
                    </p>
                    <p>
                        <b>Sign: </b> 
                        <br/>
                        <input 
                            className='form-control text bg mb-3'
                            type='text'
                            value={sign}
                            onChange={handleSign}
                            placeholder='Enter department sign!'
                        />
                    </p>
                    <div className='d-flex justify-content-end'>
                        <button className='btn btn-secondary mx-1' onClick={close}>Close</button>
                        <button
                            className='btn btn-primary mx-1'
                            onClick={handleUpdate}
                        >
                            Update
                        </button>
                    </div>
                        
                </div>
                  
            </div>
        </>
    );
}

export default Update;