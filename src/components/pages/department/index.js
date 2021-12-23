import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../axios'
import Loading from '../loading'

const Department = () => {
    document.title = 'Department'

    const navigate = useNavigate()
    const [ list, setList ] = useState()
    
    useEffect(()=> {
        const getData = async () => await api.get('/department').then(res => {
            setList(res.data)
        })
        getData()
    }, [])

    if (!list)
        return ( <Loading/> )
    return (
        <div className='card'>
            <div className='card-header text-center'>
                <h2 className='text'>Department List</h2>
            </div>
            <div className='card-body'>
                <div className='d-flex flex-wrap justify-content-center'>
                    
                    {list.map((value, index) => (
                        <div 
                            onClick={() => navigate('/department/' + value._id)}
                            key={index} 
                            className='card card-default m-3 cursor-pointer'
                        >
                            <div className='card-body department-img m-0 p-0 text-center'>
                                <img className='w-100 h-100' src={value.avatar} alt={value.name}/>
                                <div className='department-name text-center bg'>
                                    {value.name}
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    
                </div>
            </div>
        </div>
    );
};

export default Department;