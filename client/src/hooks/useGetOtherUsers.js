import { useEffect } from 'react';
import axios from "axios";
import { useDispatch } from "react-redux";
import { setOtherUser } from '../redux/userSlice';

const useGetOtherUsers = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchOtherUsers = async () => {
            try {
                axios.defaults.withCredentials = true
                const res = await axios.get(`http://localhost:8080/api/user`);
                console.log(res.data); // Logging fetched data
                dispatch(setOtherUser(res.data)); // Dispatching fetched data to Redux store
            } catch (err) {
                console.log(err);
            }
        };


        fetchOtherUsers();
    }, []); // Include dispatch in the dependency array to ensure useEffect runs only when dispatch changes
};

export default useGetOtherUsers;
