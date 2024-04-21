import io from 'socket.io-client';
import {useEffect, useState} from 'react';

const App=()=>{

  const socket=io.connect("http://localhost:5000");
  const[InputFromInputBox,setInputFromInputBox]=useState('');

  const TakeInput=(e)=>{
    setInputFromInputBox(e.target.value);
  }

  useEffect(()=>{

    socket.on('emittingEvent',(msg)=>{
      //creating Element in <ul>
    const create_element=document.getElementById('messages');
    const item=document.createElement('li');
    item.textContent=msg;
    create_element.appendChild(item);
    setInputFromInputBox("");
    });

    
    return()=>{
      socket.off('emittingEvent');
    }
  },[InputFromInputBox])

  const handleClick=(e)=>{
    if(InputFromInputBox){
      console.log(InputFromInputBox);

      socket.emit('emittingEvent',InputFromInputBox);

    }else{
      console.log("Input field is empty");
    }
  }

  return(
    <div className="w-screen h-screen grid place-items-center">
      <div className=" relative border-black w-5/6 h-4/5 border-2 rounded-xl">
        <ul id='messages'>

        </ul>
        <div className="absolute bottom-0 mb-2 w-full grid place-items-center">
          <div className="">
            <input type='text' className="w-96 border-2 rounded-md border-black px-1 " onChange={TakeInput} value={InputFromInputBox}/>
            <button className="w-fit h-fit border-2 border-black rounded-md ml-2" onClick={handleClick}>Submit</button>
          </div>
          
        </div>
      </div>
    </div>
  )
}
export default App;