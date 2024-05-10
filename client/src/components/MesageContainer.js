import React from 'react'
import profilepic from "../images/pp.jpeg";
import SendInput from './SendInput ';
import Messages from './Messages';

const MessageContainer = () => {
  return (
    <div className='md: min-w-[650px] flex flex-col '>
          <div  className="flex gap-2 items-center  bg-zinc-800  text-white px-4 py-2  mb-2">
                <div className="avatar online">
                    <div className="w-10 rounded-full">
                        <img src={profilepic} alt=""/>
                    </div>
                </div>
                <div className="flex flex-col flex-1 ">
                    <div className="flex justify-between  gap-2 ">
                        <p className="text-white">Anjali Rathor</p>
                    </div>
                </div>
             </div>
             <Messages/>
             <SendInput/>
    </div>
  )
}

export default MessageContainer