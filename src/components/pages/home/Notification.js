import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Loading from '../loading';

const Notification = ({ data }) => {

    const notif = data && data.slice(0,6)
    
    const navigate = useNavigate()

    if (!notif)
        return ( <Loading/>)

    return (
        <div className='card'>
            <div className='card-header'>
                <div className='row'>
                    <div className='col-9'>
                        <span>NEW NOTIFICATIONS</span>
                    </div>
                    <div className='col-3 d-flex justify-content-end'>
                        <Link to='/notification' className='btn-transparent'>All</Link>
                    </div>
                </div>
            </div>
            <div className='card-body p-0'>
                <ul className='list-group bg-post' style={{borderRadius: '20px'}}>
                    {notif.length === 0 && (
                        <div className='w-100 h-100 btn-transparent cursor-default text-center p-3'>
                            No Notification
                        </div>
                    )}

                    {notif.map(value => (
                        <li 
                            onClick={() => navigate('/notification/' + value._id)}
                            key={value._id} 
                            className='bg-post border-top-0 border-end-0 border-start-0 list-group-item cursor-pointer home-notification-hover'
                        >
                            <div className='text-secondary text-small d-flex justify-content-between'>
                                <div>[
                                {value.department.map((v, index) => index === value.department.length - 1 
                                    ? (
                                        <span
                                            key={v._id}
                                        >
                                            {v.sign}
                                        </span>
                                    )
                                    : (
                                        <span key={v._id}>{v.sign}, </span>
                                        
                                    )
                                )}
                                ]</div>
                                <div>{(new Date(value.createdAt)).getDate()}/{(new Date(value.createdAt)).getMonth()}/{(new Date(value.createdAt)).getFullYear()}</div>
                            </div>
                            <div>
                                <span className='text-break text-uppercase'><b>{value.name.substring(0,50)}</b></span>
                            </div>
                            <div className='post-date-size'>
                                {value.content.substring(0,100)}...
                            </div>
                        </li>
                    ))}
                </ul>
                
            </div>
        </div>
    );
};

export default React.memo(Notification);