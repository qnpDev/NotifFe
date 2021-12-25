import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../axios'
import About from '../About';
import Loading from '../loading';

const Home = () => {
    document.title = 'AdminPanel | qnp Notif'
    const [ data, setData ] = useState()
    const [ time, setTime ] = useState(new Date())

    useEffect(()=> {
        api.get('/admin').then(res => {
            if(res.data.success)
                setData(res.data)
            else
                toast.error('Somethings wrong!')
        })
    }, [])
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date())
        }, 1000 )
        return () => clearInterval(interval)
    }, [])

    if(!data)
        return ( <Loading/> )

    return (
        <>
            <div className='card text-center m-2'>
                <div className='card-body'>
                    <h5>Current Time</h5>
                    <h1 className='text-primary'>{time.toLocaleString("en-US")}</h1>
                </div>
            </div>
            <div className='row text-center m-0 p-0'>
                <div className='col-6 col-lg-3 mt-3'>
                    <div className='card'>
                        <div className='card-header fw-bold text-success'>
                            Users
                        </div>
                        <div className='card-body'>
                            <h1>{data.countUser}</h1>
                        </div>
                    </div>
                </div>
                <div className='col-6 col-lg-3 mt-3'>
                    <div className='card'>
                        <div className='card-header fw-bold text-success'>
                            Post
                        </div>
                        <div className='card-body'>
                            <h1>{data.countPost}</h1>
                        </div>
                    </div>
                </div>
                <div className='col-6 col-lg-3 mt-3'>
                    <div className='card'>
                        <div className='card-header fw-bold text-success'>
                            Department
                        </div>
                        <div className='card-body'>
                            <h1>{data.countDepartment}</h1>
                        </div>
                    </div>
                </div>
                <div className='col-6 col-lg-3 mt-3'>
                    <div className='card'>
                        <div className='card-header fw-bold text-success'>
                            Notification
                        </div>
                        <div className='card-body'>
                            <h1>{data.countNotification}</h1>
                        </div>
                    </div>
                </div>
            </div>
            <div className='m-2 mt-4'>
                <About />
            </div>
            
        </>
    );
};

export default Home;