import React, { useEffect, useState } from 'react';
import api from '../../../axios'
import { toast } from 'react-toastify';

import Users from './Users';
import Student from './Student';
import Loading from '../../loading';

const AdminUsers = () => {
    document.title = 'Users | AdminPanel'
    const [ student, setStudent ] = useState()
    const [ admin, setAdmin ] = useState()

    useEffect(()=>{
        api.get('/admin/users').then(res => {
            if(res.data.success){
                let stu = []
                let adm = []
                res.data.users.map(value =>
                    value.per.permission > 0 ? adm.push(value) : stu.push(value)
                )
                setAdmin(adm)
                setStudent(stu)
            }else{
                toast.error('Something wrong!')
            }
        })
    }, [])

    if(student && admin)
    return (
        <>
            <Users data={admin}/>
            <div className='m-4'/>
            <Student data={student}/>
        </>
    );
    else return (
        <Loading/>
    )
};

export default AdminUsers;