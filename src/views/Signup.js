import React from 'react'
import { useForm } from "react-hook-form";
import { useHistory } from 'react-router-dom'
import axios from 'axios'

const Signup = () => {
  const { register, handleSubmit } = useForm();
  const history = useHistory();

  const onSubmit = (data) => {
    axios.post('/v1/signup', data)
    .then((response) => {
      history.push('/login')
    }).catch((error) => {
      console.log(error);
    })
  }
  return (
    <div className='w-full max-w-xs space-x-40 flex items-center'>
      <form onSubmit={handleSubmit(onSubmit)} className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
        <div className='mb-4'>
        <label className='block text-gray-700 text-sm font-bold mb-2'>
          FirstName
          <input
          className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            name='firstName'
            type='text' 
            ref={register}/>
        </label>
        </div>
        <div className='mb-5'>
        <label className='block text-gray-700 text-sm font-bold mb-2'>
          LastName
        <input 
        name='lastName' 
        type='text' 
        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
        ref={register}/>
        </label>
        </div>
        <div className='mb-4'>
        <label className='block text-gray-700 text-sm font-bold mb-2'>
          Email
        <input name='email'
            type='email' 
            ref={register}
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' />
        </label>
        </div>
        <div className='mb-4'>
        <label className='block text-gray-700 text-sm font-bold mb-2'>
          UserName
          <input
            name='username' type='text'
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'

            ref={register}/>
        </label>
        </div>
        <div>
        <label className='block text-gray-700 text-sm font-bold mb-2'>
          Password
        <input name='password' type='password' 
        ref={register}/>
        </label>
        </div>
       <button type='submit'
       className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>
         Signup
       </button>
      </form>
    </div>
  )
}

export default Signup
