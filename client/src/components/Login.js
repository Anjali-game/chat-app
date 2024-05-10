import React, { useState } from "react";
import { Link , useNavigate} from "react-router-dom";
import axios from "axios";
//import toast from "react-hot-toast";
import {useDispatch} from "react-redux";
import {setAuthUser} from "../redux/userSlice.js";

const Login = () => {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onSubmithandler =async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:8080/api/user/login`,
        user,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      navigate("/");
      console.log(res.data)
      dispatch(setAuthUser(res.data));
    } catch (error) {
        
      console.log(error)
    }
   
    setUser({
      username: "",
      password: "",
    });
  };
  return (
    <div className="min-w-96 mx-auto">
      <div className="h-full w-full p-6 rounded-lg bg-yellow-500  bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 border border-gray-100">
        <h1 className="text-3xl font-bold text-center text-gray-300">Login </h1>
        <form onSubmit={onSubmithandler} action="">
          <div>
            <label className="label p-2">
              <span className="text-base label-text"> UserName</span>
            </label>
            <input
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              className="w-full input input-bordered h-10"
              type="text"
              placeholder="UserName"
            />
          </div>
          <div>
            <label className="label p-2">
              <span className="text-base label-text"> Password</span>
            </label>
            <input
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="w-full input input-bordered h-10"
              type="text"
              placeholder="Password"
            />
          </div>
          <p className="text-center ">
            Don't have an account ? <Link to="/register">Signup</Link>
          </p>
          <div>
            <button
              type="submit"
              className="btn btn-block btn-sm mt-2 border border-slate-700"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
