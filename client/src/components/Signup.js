import React, { useState } from "react";
import { Link ,useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const Signup = () => {
  const [user, setUser] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });
  const navigate =  useNavigate();
  const handleCheckBox = (gender) => {
    setUser({ ...user, gender });
  };
  const onSubmithandler = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `http://localhost:8080/api/user/register`,
        user,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
       }
     
    } catch (error) {
      toast.error(error.response.data.message)
      console.log(error)
    }
   

    console.log(user);
    setUser({
      fullName: "",
      username: "",
      password: "",
      confirmPassword: "",
      gender: "",
    });
  };
  return (
    <div className="min-w-96 mx-auto">
      <div className="h-full w-full p-6 rounded-lg bg-yellow-500  bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 border border-gray-100">
        <h1 className="text-3xl font-bold text-center text-gray-300">
          Signup{" "}
        </h1>
        <form onSubmit={onSubmithandler} action="">
          <div>
            <label className="label p-2">
              <span className="text-base label-text"> FullName</span>
            </label>
            <input
              value={user.fullName}
              onChange={(e) => setUser({ ...user, fullName: e.target.value })}
              className="w-full input input-bordered h-10"
              type="text"
              placeholder="FullName"
            />
          </div>
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
          <div>
            <label className="label p-2">
              <span className="text-base label-text"> Confirm Password</span>
            </label>
            <input
              value={user.confirmPassword}
              onChange={(e) =>
                setUser({ ...user, confirmPassword: e.target.value })
              }
              className="w-full input input-bordered h-10"
              type="text"
              placeholder="Confirm Password"
            />
          </div>
          <div className="flex items-center my-4">
            <div className="flex items-center">
              <p>Male</p>
              <input
                type="checkbox"
                checked={user.gender === "male"}
                onChange={() => handleCheckBox("male")}
               
                className="checkbox mx-2"
              />
            </div>
          </div>

          <div className="flex items-center my-4">
            <div className="flex items-center">
              <p>Female</p>
              <input
                type="checkbox"
                checked={user.gender === "female"}
                onChange={() => handleCheckBox("female")}
                
                className="checkbox mx-2"
              />
            </div>
          </div>

          <p className="text-center ">
            Already have an account ? <Link to="/login">Login</Link>
          </p>
          <div className="">
            <button
              type="submit"
              className="btn btn-block btn-sm mt-2 border border-slate-700"
            >
              Signup
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
