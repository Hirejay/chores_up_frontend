import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from "./redux/store"
import  { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <>
        <Toaster
          position="top-center"
          reverseOrder={true}
        />
        <BrowserRouter>
          <Provider store={store}> 
            <App />
          </Provider>
        </BrowserRouter>
        
    </>
  
);
