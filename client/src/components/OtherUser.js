import React from 'react'
//import profilepic from "../images/pp.jpeg";
import {useDispatch, useSelector}  from "react-redux";
import { setSelectedUser } from '../redux/userSlice';

const OtherUser = ({user}) => {
     const dispatch = useDispatch();
     const {selectedUser}  = useSelector((store)=> store.user);
  
  const selectedUserhandler = ()=>{
    dispatch(setSelectedUser(user));
  }
  return (
    <>
            <div  onClick={selectedUserhandler(user)} className={`${selectedUser?._id === user?._id ? "bg-zinc-800 ": ""} flex gap-2 items-center text-white  hover:bg-zinc-800   rounded p-2 cursor-pointer`}>
                <div className="avatar online">
                    <div className="w-10 rounded-full">
                        <img src={user?.profilePhoto} alt=""/>
                    </div>
                </div>
                <div className="flex flex-col flex-1 ">
                    <div className="flex justify-between  gap-2 ">
                        <p className="text-white">{user?.fullName}</p>
                    </div>
                </div>
             </div>
             <div className="divider my-0 py-0 h-1"></div>
    </>
  )
}

export default OtherUser