import React from 'react'

function CustomerCare() {
  return (
    <div className='bg-gray-400 h-[70%] w-[95%] rounded-lg'>
        <div className='bg-black text-center text-3xl p-3 text-white'>
            Customer Care
        </div>
        <div className='bg-green-500 w-full h-full flex flex-col items-center justify-center gap-y-4 p-8'>
            <div className='w-[40%] flex flex-col gap-2'>
                <label htmlFor="name" className='text-white text-lg font-semibold'>NAME</label>
                <div className='bg-white text-black  rounded-lg p-2 hover:shadow-3xl'>              
                      <input 
                      
                    type="text" 
                    id="name" 
                    className='bg-white text-black border border-gray-300 shadow-md p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' 
                /></div>
            </div>
            <div className='w-[40%] flex flex-col gap-2'>
                <label htmlFor="email" className='text-white text-lg font-semibold'>Email</label>
                <div className='bg-white text-black   rounded-lg p-2'>
                <input 
                    type="email" 
                    id="name" 
                    className='bg-white text-black border border-gray-300 shadow-md p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' 
                />
                </div>
            </div>
            <div className='w-[40%] flex flex-col gap-2'>
                <label htmlFor="name" className='text-white text-lg font-semibold'>Query Type</label>
                <select 
                    type="text" 
                    id="name" 
                    className='bg-white text-black border border-gray-300 shadow-md p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' 
                >
                    <option value="Enquiry">Enquiry</option>
                    <option value="bugreport">Bug Report</option>
                    <option value="compain">Complaint</option>
                </select>
            </div>
            <div className='w-[40%] flex flex-col gap-2'>
                <label htmlFor="name" className='text-white text-lg font-semibold'>Query Or Complaint</label>
                <textarea name="" className='bg-white text-black' id="" rows="10" cols="30"></textarea>
            </div>
            <div className='w-[40%] flex flex-col gap-2 items-center p-4 bg-blue-500 rounded-xl '>
                <button type="button">Submit</button>
            </div>
        </div>
    </div>
  )
}

export default CustomerCare
