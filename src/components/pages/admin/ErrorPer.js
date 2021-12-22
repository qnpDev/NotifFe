import React from 'react';
import { Link } from 'react-router-dom';
const ErrorPer = () => {
    return (
        <>
            <div className=''>
                <div className='card'>
                    <div className='card-body text-center'>
                        <h1 className='text-danger'>404</h1>
                        <br/>
                        <div className=''>
                            You do not have permission to access this page!
                        </div>
                        <br/>
                        <Link to='/'>Back to Home</Link>
                    </div>
                </div>
            </div>
        </>
    )
};



export default ErrorPer;