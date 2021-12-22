import React from 'react';
import { toast } from 'react-toastify';
import api from '../../../axios'

function Delete({ close, data, setList}) {

    const handleDelete = async() => {
        await api.post('admin/users/delete', {id: data._id}).then(res => {
            if(res.data.success){
                setList(prev => prev.filter(value => value._id !== data._id))
                toast.success(res.data.msg)
                close()
            }else{
                toast.error(res.data.msg)
            }
        })
    }
    return (
        <>
            <div className='card'>
                    <div className='card-header text-center'>
                        <h1>Are you sure?</h1>
                    </div>
                    <div className='card-body'>
                        <p>You want to delete this?</p>
                        <p><b>ID: </b> {data._id}</p>
                        <p><b>Name: </b> {data.name}</p>
                        <div className='d-flex justify-content-end'>
                            <button className='btn btn-secondary mx-1' onClick={close}>No</button>
                            <button
                                className='btn btn-danger mx-1'
                                onClick={handleDelete}
                            >
                                Yes, Delete it!
                            </button>
                        </div>
                        
                    </div>
                  
                </div>
        </>
    );
}

export default Delete;