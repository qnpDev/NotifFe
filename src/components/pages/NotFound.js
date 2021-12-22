import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div className='notfound'>
            <div className='notfound-content'>
                <div className='card p-3 m-5'>
                    <div className='card-body text-center'>
                        <h1 className='text-danger'>404</h1>
                        <br/>
                        <div className=''>
                            The requested URL was not found on this server. Plese check again!
                        </div>
                        <br/>
                        <Link to='/'>Back to Home</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;