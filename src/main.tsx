import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';


import Layout from './modules/layout';
import App from './App'
import Page1 from './page/page1';
import Page2 from './page/page2';

import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Layout>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<App />}></Route>
          <Route path='/page1' element={<Page1 />}></Route>
          <Route path='/page2' element={<Page2 />}></Route>
        </Routes>
      </BrowserRouter>
    </Layout>
  </React.StrictMode>,
)
