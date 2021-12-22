import React, { useState, useEffect } from 'react';
import api from '../../../axios'
import Loading from '../../loading'
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';

import { FiEdit, FiEye } from 'react-icons/fi'
import { IoMdRemoveCircleOutline } from 'react-icons/io'

import Create from './Add';
import { confirmAlert } from 'react-confirm-alert'
import { toast } from 'react-toastify';
import Update from './Update';

const Department = () => {
    document.title = 'Departments | AdminPanel'

    const navigate = useNavigate()
    const [ list, setList ] = useState([])
    const [ searchText, setSearchText ] = useState('')
    const [ btnCreate, setBtnCreate ] = useState(false)

    const filteredItems = list.filter(
		item => item.name.toLowerCase().includes(searchText.toLowerCase())
            || item.sign.toLowerCase().includes(searchText.toLowerCase())
	)

    const handleSearchText = e => setSearchText(e.target.value)
    const handleCreate = () => setBtnCreate(!btnCreate)
    const handleDelete = async (id, close) => {
        await api.post('/admin/department/delete', {id}).then(res=> {
            if (res.data.success){
                toast.success('Delete Successfull!')
                setList(list.filter(e => e._id !== id))
                close()
            }else{
                toast.error(res.data.msg)
            }
        })
    }
    const handleRemove = e => {
        confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <div className='card'>
                    <div className='card-header text-center'>
                        <h1>Are you sure?</h1>
                    </div>
                    <div className='card-body'>
                        <p>You want to delete this department?</p>
                        <p><b>Name: </b> {e.name}</p>
                        <p><b>Sign: </b> {e.sign}</p>
                        <div className='d-flex justify-content-end'>
                            <button className='btn btn-secondary mx-1' onClick={onClose}>No</button>
                            <button
                                className='btn btn-danger mx-1'
                                onClick={() => handleDelete(e._id, onClose)}
                            >
                                Yes, Delete it!
                            </button>
                        </div>
                        
                    </div>
                  
                </div>
              );
            }
          });
    }
    const handleUpdate = e => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <Update close={onClose} data={e} setList={setList}/>
                )
            }
        })
    }
    
    useEffect(()=> {
        const getData = async () => await api.get('/admin/department').then(res => {
            setList(res.data)
        })
        getData()
    }, [])

    if (list.length === 0)
        return ( <Loading/> )
    return (
        <>
            {btnCreate && <Create showModal={btnCreate} setShowModal={setBtnCreate} setData={setList}/>}
            <div className='card' style={{borderRadius: '0px' }}>
                <div className='card-header text-center'>
                    <h2 className='text'>Department List</h2>
                </div>
                <div className='d-flex justify-content-between m-2'>
                    <div>
                        <button onClick={handleCreate} className='btn btn-info btn-sm text-white'>
                            Add Department
                        </button>
                    </div>
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
                            name: 'ID',
                            selector: row => row._id,
                            sortable: true,
                        },
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
                            name: 'CreatedAt',
                            selector: row => new Date(row.createdAt).toLocaleString("en-US"),
                            sortable: true,
                        },
                        {
                            name: 'UpdatedAt',
                            selector: row => row.updatedAt ? new Date(row.updatedAt).toLocaleString("en-US") : '-',
                            sortable: true,
                        },
                        {
                            name: 'Action',
                            selector: row => (
                                <>
                                    <button 
                                        onClick={()=> navigate('/admin/notification/department/' + row._id)}
                                        className='btn btn-transparent text-success m-1 p-0'>
                                        <FiEye/>
                                    </button>
                                    <button onClick={() => handleUpdate(row)} className='btn btn-transparent text-info m-1 p-0'>
                                        <FiEdit/>
                                    </button>
                                    <button onClick={() => handleRemove(row)} className='btn btn-transparent text-danger m-1 p-0'>
                                        <IoMdRemoveCircleOutline/>
                                </button>
                                </>
                            )
                        },
                    ]}
                    data={filteredItems}
                    pagination
                    fixedHeader
                    theme={localStorage.getItem('darkTheme') === 'true' ? 'dark' : 'default'}
                    
                />
            </div>
            


        </>
    );
};

export default Department;