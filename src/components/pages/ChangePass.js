import React, { useContext, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import Error from './Error'
import api from '../axios'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
function ChangePass() {
    const navigate = useNavigate()
    const { userID } = useContext(UserContext)
    const [ oldPass, setOldPass ] = useState()
    const [ newPass, setNewPass ] = useState()
    const [ newPassAgain, setNewPassAgain ] = useState()

    const handleOldPass = e => setOldPass(e.target.value)
    const handleNewPass = e => setNewPass(e.target.value)
    const handleNewPassAgain = e => setNewPassAgain(e.target.value)

    const handleUpdate = () => {
        api.post('/user/password', {
            oldPassword: oldPass,
            newPassword: newPass,
        }).then(res=>{
            if(res.data.success){
                toast.success(res.data.msg)
                api.post('/auth/logout', {
                    refreshToken: localStorage.getItem('refreshToken')
                })
                localStorage.removeItem('token')
                localStorage.removeItem('refreshToken')
                navigate('/login', {replace: true})
            }else
                toast.error(res.data.msg)
        })
    }
    
    if(userID.per < 1)
        return ( <Error />)

    return (
        <>
            <div className='card'>
                <div className='card-header text-center'>
                    <h1>Change Password</h1>
                </div>
                <div className='card-body'>
                    <div className='text-center mt-2'>
                        <img 
                            className='user-avatar'
                            src={userID.avatar}
                            alt='avatar'
                        />
                    </div>
                    <div className='mt-2'>
                        <div className='mb-3'>
                            <label className='fw-bold'>
                                Old Password:
                                <span className='text-danger fw-bold'>
                                    *
                                </span>
                            </label>
                            <input 
                                type='password'
                                className='form-control text bg input-mind'
                                value={oldPass}
                                onChange={handleOldPass}
                                placeholder='Enter old password!'
                            />
                            {oldPass && oldPass.length < 4 && (
                                <label className='text-small text-danger d-flex justify-content-end'>At least 4 character!</label>
                            )}
                        </div>
                        <div className='mb-3'>
                            <label className='fw-bold'>
                                New Password:
                                <span className='text-danger fw-bold'>
                                    *
                                </span>
                            </label>
                            <input 
                                type='password'
                                className='form-control text bg input-mind'
                                value={newPass}
                                onChange={handleNewPass}
                                placeholder='Enter new password!'
                            />
                            {newPass && newPass.length < 4 && (
                                <label className='text-small text-danger d-flex justify-content-end'>At least 4 character!</label>
                            )}
                        </div>
                        <div className='mb-3'>
                            <label className='fw-bold'>
                                New Password again:
                                <span className='text-danger fw-bold'>
                                    *
                                </span>
                            </label>
                            <input 
                                type='password'
                                className='form-control text bg input-mind'
                                value={newPassAgain}
                                onChange={handleNewPassAgain}
                                placeholder='Enter new password again!'
                            />
                            {newPass && newPassAgain && newPass !== newPassAgain && (
                                <label className='text-small text-danger d-flex justify-content-end'>Not match!</label>
                            )}
                        </div>
                    
                        <div className='mt-4 d-flex justify-content-end mx-2'>
                            <button 
                                className={oldPass && newPass && newPassAgain && (oldPass.length >= 4) && (newPass.length >= 4) && (newPass === newPassAgain) ? 'btn btn-success ' : 'btn btn-secondary ' }
                                disabled={oldPass && newPass && newPassAgain && (oldPass.length >= 4) && (newPass.length >= 4) && (newPass === newPassAgain) ? false : true}
                                onClick={handleUpdate}
                            >Change Password</button>
                        </div>
                    </div>    
                </div>
            </div>
        </>
    );
}

export default ChangePass;