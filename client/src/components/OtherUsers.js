import React from "react";
import OtherUser from "./OtherUser";
import useGetOtherUsers from "../hooks/useGetOtherUsers";
import { useSelector  } from "react-redux";
const OtherUsers = () =>{
//my custom hook
    useGetOtherUsers();
      const otherUsers = useSelector((store)=> store.user.otherUser);
      console.log(otherUsers)
      if (!otherUsers || otherUsers.length === 0) {
        return <div>Loading...</div>;
    }
  console.log(otherUsers)


    return(
        <div className="overflow-auto flex-1">
          {
            otherUsers?.map((user)=>{
                return(
                    <OtherUser key={user._id} user ={user}/>
                )
            })
          }

         

         
        </div>
        
    )
}

export default  OtherUsers;