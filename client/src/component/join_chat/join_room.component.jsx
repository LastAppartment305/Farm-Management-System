const Join=()=>{
    return(
        <div className="w-screen h-screen grid place-items-center bg-sky-900">
            <div className="w-fit p-5 grid grid-rows-3 gap-4">
                <input type="text" className="border-2 border-black rounded-md w-96 h-12 pl-2" placeholder="Name"/>
                <input type="text" className="border-2 border-black rounded-md w-96 h-12 pl-2" placeholder="Room ID"/>
                <button className="font-mono text-white text-xl border-black rounded-md bg-indigo-500 w-96 h-12 hover:bg-indigo-700">Join</button>
            </div>
        </div>
    )
}
export default Join;