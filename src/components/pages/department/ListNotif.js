import React, { useContext, useEffect, useState } from 'react';
import Loading from '../loading';
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../axios'
import { toast } from 'react-toastify';
import DataTable from 'react-data-table-component';
import { UserContext } from '../../contexts/UserContext';
import Error from '../Error';

function ListNotif() {
    
    const navigate = useNavigate()
    const { userID } = useContext(UserContext)
    const { id } = useParams()
    const [ list, setList ] = useState()
    const [ dataDepartment, setDataDepartment ] = useState()
    const [ searchText, setSearchText ] = useState('')
    const [ filterImportant, setFilterImportant ] = useState(false)
    const [ filterNotSeen, setFilterNotSeen ] = useState(false)
    const [ err, setErr ] = useState(false)

    let filteredItems = list && list.filter(
		item => item.name.toLowerCase().includes(searchText.toLowerCase())
            || item.content.toLowerCase().includes(searchText.toLowerCase())
	) 
    if (filterImportant) {
        filteredItems = filteredItems.filter(item => item.important === true)
    }
    if (filterNotSeen) {
        filteredItems = filteredItems.filter(item => !item.read.includes(userID.id))
    }
    
    const handleSearchText = e => setSearchText(e.target.value)
    const handleSearchImportant = () => setFilterImportant(!filterImportant)
    const handleSearchNotSeen = () => setFilterNotSeen(!filterNotSeen)

    useEffect(()=>{
        api.get('/department/listNotif', {
            params: {
                idDepartment: id
            }
        }).then(res=>{
            if(res.data.success){
                setList(res.data.data)
                setDataDepartment(res.data.department)
            }else{
                toast.error(res.data.msg)
                setErr(true)
            }
        })
    }, [ id ])

    document.title = (dataDepartment && dataDepartment.name) ||'List Notification'
    if (err) return ( <Error/> )
    if (!list || !dataDepartment)
        return ( <Loading/> )
    return (
        <>
            <div className='card' style={{borderRadius: '0px' }}>
                <div className='card-header text-center'>
                    <h2 className='text'>Notification List</h2>
                    <h5>{dataDepartment.name}</h5>
                </div>
                <div className='d-flex justify-content-between m-2'>
                    <div className='form-check'>
                        <input 
                            id='important'
                            type='checkbox'
                            onClick={handleSearchImportant}
                            className='form-check-input'/>
                        <label 
                            htmlFor='important'
                            className='form-check-label'>
                            Important
                        </label>
                    </div>
                    <div className='form-check'>
                        <input 
                            id='notseen'
                            type='checkbox'
                            onClick={handleSearchNotSeen}
                            className='form-check-input'/>
                        <label 
                            htmlFor='notseen'
                            className='form-check-label'>
                            Not seen
                        </label>
                    </div>
                    <div>
                        <input
                            className='form-control input-mind bg-light text'
                            type="text"
                            placeholder="Filter By Name | Content"
                            aria-label="Search Input"
                            onChange={handleSearchText}
                            value={searchText}
                        />
                    </div>
                </div>

                <DataTable
                    columns={[
                        {
                            name: 'Title',
                            selector: row => row.name,
                            sortable: true,
                        },
                        {
                            name: 'Content',
                            selector: row => row.content,
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
                        
                    ]}
                    data={filteredItems}
                    pagination
                    fixedHeader
                    theme={localStorage.getItem('darkTheme') === 'true' ? 'dark' : 'default'}
                    onRowClicked={row => navigate('/notification/' + row._id)}
                    highlightOnHover
                    pointerOnHover
                />
            </div>
        </>
    );
}

export default ListNotif;