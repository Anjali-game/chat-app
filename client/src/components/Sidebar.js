
import React from 'react'
import { CgSearch } from "react-icons/cg";
import OtherUsers from './OtherUsers';
import axios from "axios";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";
const Sidebar = () => {
    const navigate = useNavigate()
  const logOuthandler =async() =>{
    try {
      axios.defaults.withCredentials = true;
      const res =await axios.get(`http://localhost:8080/api/user/logout`);
      console.log(res)
      toast.success(res.data.message)
      navigate("/login");

    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className='border-r border-slate-500 p-4 flex flex-col'>
      <form action='' className='flex items-center gap-2'>
        <input className='input input-bordered rounded-md ' type='text'
        placeholder='Search...'/>

        <button type='submit ' className='btn bg-zinc-700 text-white'>
        <CgSearch className="w-6 h-6 outline-none" />
        </button>
      </form>
      <div className='divider px-3' ></div>
      <OtherUsers/>
      <div className="mt-2">
            <button  onClick={logOuthandler} className="btn btn-sm" >LogOut</button>
         </div>


    </div>
  )
}

export default Sidebar