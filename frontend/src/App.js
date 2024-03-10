import React from 'react';
import Login from './login';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import SignUp from './SignUp';
import Home from './home';
import My_account from './My_account';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Login/>}></Route>
      <Route path='/signup' element={<SignUp/>}></Route>
      <Route path='/home' element={<Home/>}></Route>
      <Route path='/my_account' element={<My_account/>}></Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App;
