import React, { useEffect, useState } from 'react';
import api from '../../../axios'
import Loading from '../../loading'
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';

import { FiEdit, FiEye } from 'react-icons/fi'
import { IoMdRemoveCircleOutline } from 'react-icons/io'

import { confirmAlert } from 'react-confirm-alert'
import Add from './Add';
import Update from './Update';
import Delete from './Delete';
import Error from '../../Error';

function Notification() {
    document.title = 'Notification | AdminPanel'
    
    const navigate = useNavigate()
    const [ list, setList ] = useState()
    const [ listDepartment, setListDepartment ] = useState()
    const [ checkPer, setCheckPer ] = useState(true)
    const [ searchText, setSearchText] = useState('')
    const [ searchTextDepartment, setSearchTextDepartment ] = useState('')

    const filteredItems = list && list.filter(
		item => item.name.toLowerCase().includes(searchText.toLowerCase())
        || item.content.replace( /(<([^>]+)>)/ig, '').toLowerCase().includes(searchText.toLowerCase())
	)
    const fileredDepartment = listDepartment && listDepartment.filter(
		item => item.name.toLowerCase().includes(searchTextDepartment.toLowerCase())
            || item.sign.toLowerCase().includes(searchTextDepartment.toLowerCase())
	)

    const handleCreate = () => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <Add close={onClose} listDepartment={listDepartment} setList={setList}/>
                )
            }
        })
    }
    const handleSearchText = e => setSearchText(e.target.value)
    const handleSearchTextDepartment = e => setSearchTextDepartment(e.target.value)
    const handleUpdate = e => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <Update close={onClose} data={e} listDepartment={listDepartment} setList={setList}/>
                )
            }
        })
    }
    const handleRemove = e => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <Delete close={onClose} data={e} setList={setList}/>
                )
            }
        })
    }

    useEffect(() => {
        api.get('/manager').then(res=>{
            if(res.data.success){
                setList(res.data.data)
                setListDepartment(res.data.department)
            }else{
                setCheckPer(false)
            }
        })
    }, [])

    if(!list || !listDepartment)
        return ( <Loading /> )
    if(!checkPer)
        return ( <Error />)
    return (
        <>
            <div className='card mb-3' style={{borderRadius: '0px' }}>
                <div className='card-header text-center'>
                    <h2 className='text'>Department List</h2>
                </div>
                <div className='d-flex justify-content-end m-2'>
                    <div>
                        <input
                            className='form-control input-mind bg-light text'
                            type="text"
                            placeholder="Filter By Name | Sign"
                            aria-label="Search Input"
                            onChange={handleSearchTextDepartment}
                            value={searchTextDepartment}
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
                    data={fileredDepartment}
                    pagination
                    fixedHeader
                    theme={localStorage.getItem('darkTheme') === 'true' ? 'dark' : 'default'}
                    highlightOnHover
                    pointerOnHover
                    onRowClicked={row => navigate('/manager/department/' + row._id)}
                />
            </div>

            <div className='card' style={{borderRadius: '0px' }}>
                <div className='card-header text-center'>
                    <h2 className='text'>Notification List</h2>
                </div>
                <div className='d-flex justify-content-between m-2'>
                    <div>
                        <button onClick={handleCreate} className='btn btn-info btn-sm text-white'>
                            Add Notification
                        </button>
                    </div>
                    <div>
                        <input
                            className='form-control input-mind bg-light text'
                            type="text"
                            placeholder="Filter By Title | Content"
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
                            name: 'Title',
                            selector: row => row.name && row.name.replace( /(<([^>]+)>)/ig, '').substring(0,100),
                            sortable: true,
                        },
                        {
                            name: 'Content',
                            selector: row => row.content && row.content.replace( /(<([^>]+)>)/ig, '').substring(0,100),
                            sortable: true,
                        },
                        {
                            name: 'Important',
                            selector: row => row.important ? 'Yes' : 'No',
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
                                        onClick={()=> navigate('/notification/' + row._id)}
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
}

export default Notification;