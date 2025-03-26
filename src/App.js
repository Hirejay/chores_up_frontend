import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import ResetPassword from './components/ResetPassword';
import NewPassword from './components/NewPassword';
import ProtectedRoute from './dashboards/ProtectedRoute';
import { Navigate } from 'react-router-dom';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Dashboard from './pages/Dashboard';
import ClientDashboard from './dashboards/ClientDashboard';
import WorkerDashboard from './dashboards/WorkerDashboard';
import AdminDashboard from './dashboards/AdminDashboard';
import CreateServicePost from "./dashboards/clients/CreateServicePost"
import ViewRequestedServicePosts from "./dashboards/clients/ViewRequestedServicePosts";
import PastServices from "./dashboards/clients/PastServices";
import ActiveServicePosts from "./dashboards/clients/ActiveServicePosts";
import Profile from './pages/Profile';
import ViewActiveWorkers from './dashboards/admins/ViewActiveWorkers';
import ViewEPFO from './dashboards/admins/ViewEPFO';
import AddCategory from './dashboards/admins/AddCategory';
import ViewWorkerRequests from './dashboards/admins/ViewWorkerRequests';
import ViewEditCategories from './dashboards/admins/ViewEditCategories';
import ViewActiveService from './dashboards/workers/ViewActiveService';
import HistoryServices from './dashboards/workers/HistoryServices';
import ViewAllServiceRequests from './dashboards/workers/ViewAllServiceRequests';
import { LocationProvider } from './contexts/LocationContext';

import ViewActiveServiceMap from './dashboards/workers/ViewActiveServiceMap';
import ViewActive from './dashboards/workers/ViewActive';

import ActiveServiceMap from './dashboards/clients/ActiveServiceMap';
import ActiveServices from './dashboards/clients/ActiveServices';
import DashBoardProfile from './pages/DashBoardProfile';
function App() {
  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar className='fixed top-0 left-0 w-full z-50' />


      <div className='flex-grow pt-16'>
        <Routes>
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<Home />} />
          <Route path='/AboutUs' element={<AboutUs />} ></Route>
          <Route path='/ContactUs' element={<ContactUs />} />
          <Route path='/resetpassword' element={<ResetPassword />} />
          <Route path='/update-password/:token' element={<NewPassword />} />
          
          
          

          <Route element={<ProtectedRoute  allowed={['client']}/>}>
            <Route path="/dashboard/client" element={<ClientDashboard />}>
              <Route index element={<DashBoardProfile/>} />  {/* Default route */}
              <Route path="create-service-post" element={<CreateServicePost />} />
              <Route path="view-requested-service-posts" element={<ViewRequestedServicePosts />} />
              <Route path="active-service-posts" element={<ActiveServices/>}>
                  <Route index element={<ActiveServicePosts />} />
                  <Route path="active-service-map/:taskId" element={<ActiveServiceMap/>} />
              </Route>
      
             
              <Route path="past-services" element={<PastServices />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowed={['admin']} />}>
            <Route path="/dashboard/admin" element={<AdminDashboard />}>
              <Route index element={<DashBoardProfile/>} /> {/* Default route */}
              <Route path="view-requested-workers" element={<ViewWorkerRequests/>} />
              <Route path="view-EPFO" element={<ViewEPFO />} />
              <Route path="view-active-workers" element={<ViewActiveWorkers />} />
              <Route path="add-category" element={<AddCategory />} />
              <Route path="view-edit-category" element={<ViewEditCategories/>} />
            </Route>
          </Route>



          <Route element={<ProtectedRoute allowed={['worker']}/>}>
            <Route path="/dashboard/worker" element={<LocationProvider>
                <WorkerDashboard />
              </LocationProvider>}>
              <Route index element={<DashBoardProfile/>} />  {/* Default route */}
              <Route path='profile' element={<Profile/>}/>
              <Route path="view-all-service-requests" element={<ViewAllServiceRequests/>} />
              {/* <Route path="view-active-service" element={<ViewActiveService/>} /> */}
              <Route path="view-active-service" element={<ViewActive/>} >
                <Route index element={<ViewActiveService/>}/>
                <Route path="view-active-service-map/:taskId" element={<ViewActiveServiceMap/>}/>
              </Route>
              <Route path="history-services" element={<HistoryServices/>} />
            </Route>
          </Route>


          <Route path="/dashboard" element={<Dashboard/>}/>

          

          
          
          

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
