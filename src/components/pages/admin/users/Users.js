import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import api from '../../../axios'
import Loading from '../../loading';

import { FiEdit, FiEye } from 'react-icons/fi'
import { IoMdRemoveCircleOutline } from 'react-icons/io'
import Add from './Add';
import Delete from './Delete';
import { confirmAlert } from 'react-confirm-alert'
import Update from './Update';

const Users = ({data}) => {

    const [ list, setList ] = useState(data)
    const navigate = useNavigate()
    const [ searchText, setSearchText ] = useState('')
    const [ btnCreate, setBtnCreate ] = useState(false)
    const [ listDepartment, setListDepartment ] = useState([])

    const filteredItems = list.filter(
		item => (item.name && item.name.toLowerCase().includes(searchText.toLowerCase()))
            || (item.per.username && item.per.username.toLowerCase().includes(searchText.toLowerCase()))
	)

    const handleSearchText = e => setSearchText(e.target.value)
    const handleCreate = () => setBtnCreate(!btnCreate)
    const handleRemove = e => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <Delete close={onClose} data={e} setList={setList}/>
                )
            }
        })
    }
    const handleUpdate = e => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <Update close={onClose} data={e} setList={setList} listDepartment={listDepartment}/>
                )
            }
        })
    }

    useEffect(()=> {
        const getData = async () => await api.get('/admin/department').then(res => {
            setListDepartment(res.data)
        })
        getData()
    }, [])
    if (listDepartment.length === 0)
        return ( <Loading/> )
    return (
        <>
            {btnCreate && <Add showModal={btnCreate} setShowModal={setBtnCreate} setData={setList} listDepartment={listDepartment}/>}
            <div className='card' style={{borderRadius: '0px' }}>
                <div className='card-header text-center'>
                    <h2 className='text'>Users Management</h2>
                </div>

                <div className='d-flex justify-content-between m-2'>
                    <div>
                        <button onClick={handleCreate} className='btn btn-info btn-sm text-white'>
                            Add Users
                        </button>
                    </div>
                    <div>
                        <input
                            className='form-control input-mind bg-light text'
                            type="text"
                            placeholder="Filter By Name | Username"
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
                        // {
                        //     name: 'Avatar',
                        //     selector: row => (
                        //         <div className='d-flex justify-content-center'>
                        //             <div className='post-img-new-comment'> 
                        //                 <img src={row.avatar} alt=''/> 
                        //             </div>
                        //         </div>
                        //     ),
                        //     sortable: true,
                        // },
                        {
                            name: 'Name',
                            selector: row => row.name,
                            sortable: true,
                        },
                        {
                            name: 'Username',
                            selector: row => row.per.username,
                            sortable: true,
                        },
                        {
                            name: 'Permission',
                            selector: row => (row.per.permission === 2 ? 'Admin' : row.per.permission === 1 ? 'Manager' : 'Student'),
                            sortable: true,
                        },
                        {
                            name: 'CreateAt',
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
                                        onClick={()=> navigate('/wall/' + row._id)}
                                        className='btn btn-transparent text-success m-1 p-0'>
                                        <FiEye/>
                                    </button>
                                    <button
                                        onClick={() => handleUpdate(row)}
                                        className='btn btn-transparent text-info m-1 p-0'>
                                        <FiEdit/>
                                    </button>
                                    <button
                                        onClick={() => handleRemove(row)}
                                        className='btn btn-transparent text-danger m-1 p-0'
                                    >
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

export default React.memo(Users);