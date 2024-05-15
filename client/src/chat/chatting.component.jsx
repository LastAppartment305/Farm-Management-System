import io from 'socket.io-client';
import {useEffect, useState} from 'react';

const Chatting=()=>{

  const socket=io.connect("http://localhost:5000");
  const[InputFromInputBox,setInputFromInputBox]=useState('');
  const[messageList,setmessageList]=useState([]);

  const TakeInput=(e)=>{
    setInputFromInputBox(e.target.value);
  }

  // useEffect(()=>{

  //   socket.on('emittingEvent',(msg)=>{
  //     //creating Element in <ul>
  //   const create_element=document.getElementById('messages');
  //   const item=document.createElement('li');
    
  //   item.textContent=msg;
  //   console.log("author: "+msg.author? "you" : "other")
  //   create_element.appendChild(item);
  //   setInputFromInputBox("");
  //   });
  //   // Testing author
  //   //console.log("author: "+InputFromInputBox.author? console.log("other") : console.log("you"));
    
  //   return()=>{
  //     socket.off('emittingEvent');
  //   }
  // },[InputFromInputBox])


  useEffect(()=>{

    const listenToEvent=(value)=>{
      setmessageList((list)=>[...list,value])
    }
    socket.on('receivingEvent',listenToEvent)

    return()=>{
      socket.off('receivingEvent',listenToEvent);
    }
  },[socket])


  const handleClick=async(e)=>{
    if(InputFromInputBox){
      //console.log(InputFromInputBox);

      await socket.emit('emittingEvent',InputFromInputBox);
      setmessageList((list)=>[...list,InputFromInputBox])
      setInputFromInputBox("");
      console.log(socket);
    }else{
      console.log("Input field is empty");
    }
  }

  return(
    <div className="w-screen h-screen grid place-items-center">
      <div className=" relative border-black w-5/6 h-4/5 border-2 rounded-xl">

        <div>
          
          {messageList.map((messageContent,index)=>{
            return(
              <p key={index}>{messageContent}</p>
              
            )
          })}
        </div>

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
export default Chatting;