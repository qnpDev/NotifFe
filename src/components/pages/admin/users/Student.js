import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';

import { FiEdit, FiEye } from 'react-icons/fi'
import { IoMdRemoveCircleOutline } from 'react-icons/io'

import Delete from './Delete';
import { confirmAlert } from 'react-confirm-alert'
import UpdateStudent from './UpdateStudent';
const Student = ({data}) => {

    const [ list, setList ] = useState(data)
    const navigate = useNavigate()
    const [ searchText, setSearchText ] = useState('')
    const filteredItems = list.filter(
		item => (item.name && item.name.toLowerCase().includes(searchText.toLowerCase()))
            || (item.per.mail && item.per.email.toLowerCase().includes(searchText.toLowerCase()))
	);

    const handleSearchText = e => {
        setSearchText(e.target.value)
    }
    const handleUpdate = e => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <UpdateStudent close={onClose} data={e} setList={setList}/>
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
    return (
        <>
            <div className='card' style={{borderRadius: '0px' }}>
                <div className='card-header text-center'>
                    <h2 className='text'>Student Management</h2>
                </div>

                <div className='d-flex justify-content-between m-2'>
                    <div>
                        
                    </div>
                    <div>
                        <input
                            className='form-control input-mind bg-light text'
                            type="text"
                            placeholder="Filter By Name | Mail"
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
                            name: 'email',
                            selector: row => row.per.email,
                            sortable: true,
                        },
                        {
                            name: 'CreateAt',
                            selector: row => new Date(row.createdAt).toLocaleString("en-US"),
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
                                        className='btn btn-transparent text-danger m-1 p-0'>
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

export default React.memo(Student);