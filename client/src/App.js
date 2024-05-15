import io from 'socket.io-client';
import {useEffect, useState} from 'react';
import {Routes,Route} from 'react-router-dom';
import Home from './component/Home/home.component';
import Join from './component/join_chat/join_room.component';

const App=()=>{

  //const socket=io.connect("http://localhost:5000");
  
  return(
    
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='join' element={<Join/>}/>
      </Routes>
    
  )
}
export default App;