import React from 'react';
import ReactLoading from 'react-loading'
const Loading = () => {
    return (
        <div className='centervh'>
            <div className='centervh-content'>
                <ReactLoading type='spinningBubbles' color='red' className='centervh-item'/>
            </div>
        </div>
    );
};

export default Loading;