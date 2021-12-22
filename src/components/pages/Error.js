import React from 'react';
import { Link } from 'react-router-dom';

function Error() {
    return (
        <>
            <div className='center-v-h'>
                <div className='card'>
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
        </>
    );
};

export default Error;