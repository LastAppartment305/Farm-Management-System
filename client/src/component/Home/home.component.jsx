import { useNavigate,Link } from "react-router-dom";

const Home=()=>{

    const navigate=useNavigate();
    const handleJoin=()=>{
        navigate('/join');
    }

    return(
        <div className="w-screen h-screen grid place-items-center bg-sky-900">
      <div className='grid grid-rows-2 gap-4 w-96 '>
        <button className='font-mono text-xl rounded-md h-12 bg-indigo-500 hover:bg-indigo-700 text-white' onClick={()=>handleJoin()}>Join A Room</button>
        <button className='font-mono text-xl rounded-md h-12 bg-indigo-500 hover:bg-indigo-700 text-white'>Create Room</button>
      </div>
    </div>
    )
}
export default Home;