import React from 'react';

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom'
import { UserProvider } from './components/contexts/UserContext';
import { IoProvider } from './components/contexts/IoContext'
import Static from './components/pages/statics';
import Home from './components/pages/home'
import Login from './components/pages/Login';
import Wall from './components/pages/wall';
import Logout from './components/pages/Logout';
import AllNotification from './components/pages/notification';
import NotificationDetail from './components/pages/notification/Detail'
import Department from './components/pages/department';
import DepartmentListNotif from './components/pages/department/ListNotif'
import Admin from './components/pages/statics/admin';
import AdminHome from './components/pages/admin';
import AdminUser from './components/pages/admin/users/index.js'
import AdminDepartment from './components/pages/admin/department'
import AdminNotification from './components/pages/admin/notification/Admin'
import AdminNotifByDepartment from './components/pages/admin/notification/byDepartment/Admin'
import ManagerNotification from './components/pages/admin/notification'
import ManagerNotifByDepartment from './components/pages/admin/notification/byDepartment'
import About from './components/pages/About';
import NotFound from './components/pages/NotFound';
import ChangePass from './components/pages/ChangePass';


function App() {
  return (
    <IoProvider>
      <UserProvider>
        <Router>
          <Routes>
            <Route path='/login' element={<Login/>}/>
            <Route path='/' element={<Static/>}>
              <Route index element={<Home/>}/>
              <Route path='wall/*' element={<Wall/>}/>
              <Route path='wall/:id' element={<Wall/>}/>
              <Route path='logout/*' element={<Logout/>}/>
              <Route path='notification/*' element={<AllNotification/>}/>
              <Route path='notification/:id' element={<NotificationDetail/>}/>
              <Route path='department/*' element={<Department/>}/>
              <Route path='department/:id' element={<DepartmentListNotif/>}/>
              <Route path='manager/*' element={<ManagerNotification/>}/>
              <Route path='manager/department/:id' element={<ManagerNotifByDepartment/>}/>
              <Route path='about/*' element={<About/>}/>
              <Route path='password/*' element={<ChangePass/>}/>
            </Route>
            <Route path='/admin' element={<Admin/>}>
              <Route index element={<AdminHome/>}/>
              <Route path='users/*' element={<AdminUser/>}/>
              <Route path='department/*' element={<AdminDepartment/>}/>
              <Route path='notification/*' element={<AdminNotification/>}/>
              <Route path='notification/department/:id' element={<AdminNotifByDepartment/>}/>
              <Route path='about/*' element={<About/>}/>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </UserProvider>
    </IoProvider>
  );
}

export default App;
