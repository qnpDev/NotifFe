import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../axios'
import Loading from '../loading';
import { BsArrowDownCircleFill } from 'react-icons/bs'
import Error from '../Error';

function Detail() {

    const navigate = useNavigate()
    const { id } = useParams()
    const [ data, setData ] = useState()
    const [ err, setErr ] = useState(false)
    
    useEffect(() => {
        api.get('/notification/detail', {
            params: {
                idNotif: id
            }
        }).then(res=> {
            if (res.data.success)
                setData(res.data.data)
            else{
                toast.error(res.data.msg)
                setErr(true)
            }
        })
    }, [ id ])

    useEffect(()=> {
        document.title = (data && data.name) || 'Notification Detail'
    }, [ data ])
    if (err) return ( <Error /> )
    if(!data)
        return ( <Loading /> )
    return (
        <>
            <div className='card' style={{borderRadius: '0px' }}>
                <div className='card-header text-center'>
                    <h1 className='text-uppercase'>{data.name}</h1>
                </div>
                <div className='card-body'>
                    <div className='d-flex justify-content-between text-small'>
                        <div className='fst-italic'>
                            {data.department.map((value, index) => index === data.department.length - 1 
                                ? (
                                    <span
                                        key={index}
                                        className='cursor-pointer text-primary'  
                                        onClick={() => navigate('/department/' + value._id)}>
                                        {value.name}
                                    </span>
                                )
                                : (
                                    <span key={index}>
                                        <span
                                            key={index}
                                            className='cursor-pointer text-primary'  
                                            onClick={() => navigate('/department/' + value._id)}>
                                            {value.name}
                                        </span>
                                        <span className='text-primary'>, </span>
                                    </span>
                                    
                                )
                            )}
                        </div>
                        <div className='fst-italic'>
                            <span className='text-secondary'>Date created: </span>
                            <span className='text-success'>
                                {new Date(data.createdAt).toLocaleString("vi-VN")}
                            </span>
                        </div>
                    </div>
                    <div className='m-2 mt-5' style={{whiteSpace: 'pre-wrap'}}>
                        {data.content}
                    </div>
                    {data.file.length > 0 && (
                        <div className='mt-5 border-top'>
                            <h4 className='fst-italic text-primary'>Files: </h4>
                            <ul className='list-group'>
                                {data.file && data.file.map((value, index) => (
                                    <li key={index} className='list-group-item bg'>
                                        <div className='d-flex justify-content-between'>
                                            <div>{value.split('/')[value.split('/').length - 1]}</div>
                                            <a 
                                                href={value}
                                                download
                                                className='text-danger cursor-pointer'
                                            >
                                                <BsArrowDownCircleFill/>
                                            </a>
                                        </div>    
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    
                </div>
            </div>
        </>
    );
}

export default Detail;