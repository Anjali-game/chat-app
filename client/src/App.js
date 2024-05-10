import React from 'react'
import {createBrowserRouter,RouterProvider}  from 'react-router-dom'
import Signup from './components/Signup'
import Login from './components/Login'
import Homepage from './components/Homepage'

const router = createBrowserRouter([
  {
    path:"/register",
    element: <Signup/>
  },
  {
    path:"/login",
    element: <Login/>
  },
  {
    path:"/",
    element: <Homepage/>
  }
])

const App = () => {
  return (
    <div className='p-4 h-screen flex items-center justify-center'>
      <RouterProvider router ={router}/>
    </div>
  )
}

export default App 