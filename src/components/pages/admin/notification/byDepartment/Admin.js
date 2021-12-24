import React, { useEffect, useState } from 'react';
import api from '../../../../axios'
import Loading from '../../../loading'
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { FiEdit, FiEye } from 'react-icons/fi'
import { IoMdRemoveCircleOutline } from 'react-icons/io'
import { useParams } from 'react-router';
import { confirmAlert } from 'react-confirm-alert'
import Add from './Add';
import Update from '../Update';
import Delete from '../Delete';
import Error from '../../../Error';

function Notification() {
    
    const navigate = useNavigate()
    const { id } = useParams()
    const [ list, setList ] = useState()
    const [ listDepartment, setListDepartment ] = useState()
    const [ checkPer, setCheckPer ] = useState(true)
    const [ searchText, setSearchText] = useState('')

    const filteredItems = list && list.filter(
		item => item.name.toLowerCase().includes(searchText.toLowerCase())
        || item.content.replace( /(<([^>]+)>)/ig, '').toLowerCase().includes(searchText.toLowerCase())
	)

    const handleCreate = () => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <Add close={onClose} idDepartment={id} setList={setList}/>
                )
            }
        })
    }
    const handleSearchText = e => setSearchText(e.target.value)
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
        api.get('/manager/department/admin',{
            params: {
                idDepartment: id,
            }
        }).then(res=>{
            if(res.data.success){
                setList(res.data.data)
                setListDepartment(res.data.department)
            }else{
                setCheckPer(false)
            }
        })
    }, [ id ])

    document.title = (listDepartment && listDepartment.map(value => value._id === id ? value.name : null)) || 'Notification | AdminPanel'

    if(!list || !listDepartment)
        return ( <Loading /> )
    if(!checkPer)
        return ( <Error />)
    return (
        <>
            <div className='card' style={{borderRadius: '0px' }}>
                <div className='card-header text-center'>
                    <h2 className='text'>Notification List</h2>
                    <h5>{listDepartment.map(value => value._id === id ? value.name : null)}</h5>
                </div>
                <div className='d-flex justify-content-between m-2'>
                    <div>
                        <button onClick={handleCreate} className='btn btn-info btn-sm text-white'>
                            Add Notification into Department
                        </button>
                    </div>
                    <div>
                        <input
                            className='form-control input-mind bg-light text'
                            type="text"
                            placeholder="Filter By Title"
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
                            name: 'Author',
                            selector: row => row.author.name,
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