import React from 'react';
import { Box, Text, Flex } from '@radix-ui/themes';
import avatar from '../../../assets/devv.jpeg';
import { Form } from 'radix-ui';
import { useAuth } from "../../AuthContext"; // ✅ Import useAuth properly
import { Link } from 'react-router-dom'
import { Navigate } from 'react-router-dom';
function ArtSettings() {
	 const { user } = useAuth(); 
	//  if (!user){
	//  	return <Navigate to="/login"/>
	//  }
  return (
    <div className="w-[90vw] max-w-3xl mx-auto bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 p-10 h-[5vw]">
      
      {/* Header Section */}
      <Box className="flex flex-col items-center">
        <h1 className="text-4xl font-semibold text-center text-gray-900 dark:text-white">Account Settings</h1>

        {/* Avatar Section */}
        <Box className="mt-6 ml-[40%] flex flex-col items-center text-center justify-items-center"><br/>
          <img src={avatar} className="rounded-full border-4 border-green-500 w-24 h-24" alt="User Avatar" /><br/><br />
          {/* <Text className="mt-3 text-lg font-medium text-gray-700 dark:text-gray-300">@{user?.username || "LOGIN"}</Text> */}
        </Box>
        <Box className='ml-[45%]'>
        <Text className="mt-3  text-lg font-medium text-gray-700 dark:text-gray-300">@{user?.username || "LOGIN"}</Text>
        </Box>
      </Box>

      {/* Form Section */}
      <Box className="mt-8 p-6 w-full max-w-lg mx-auto bg-gray-100 dark:bg-gray-900 rounded-lg shadow">
        <Form.Root className="space-y-6 w-full">

          {/* First Name & Last Name */}
          <Flex gap="6" className="flex flex-col sm:flex-row">
            <Form.Field className="flex flex-col w-full" name="firstName">
              <Form.Label className="text-gray-900 dark:text-gray-300 font-medium">First Name</Form.Label><br/>
              <Form.Control asChild>
                <input className="w-full p-3 border rounded-md bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 " type="text" placeholder={user?.first_name} disabled required  />
              </Form.Control>
              <Form.Message className="text-red-500 text-sm" match="valueMissing">Please enter your first name</Form.Message>
            </Form.Field>

            <Form.Field className="flex flex-col w-full" name="lastName">
              <Form.Label className="text-gray-900 dark:text-gray-300 font-medium">Last Name</Form.Label><br/>
              <Form.Control asChild>
                <input className="w-full p-3 border rounded-md bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500" type="text" required placeholder={user?.last_name} disabled  />
              </Form.Control>
              <Form.Message className="text-red-500 text-sm" match="valueMissing">Please enter your last name</Form.Message>
            </Form.Field>
          </Flex>

          {/* Email Field */}
          <Form.Field className="flex flex-col" name="email">
            <Form.Label className="text-gray-900 dark:text-gray-300 font-medium">Email</Form.Label><br/>
            <Form.Control asChild>
              <input className="w-full p-3 border rounded-md bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500" type="email" required placeholder={user?.email} disabled />
            </Form.Control>
            <Form.Message className="text-red-500 text-sm" match="valueMissing">Please enter your email</Form.Message>
            <Form.Message className="text-red-500 text-sm" match="typeMismatch">Please provide a valid email</Form.Message>
          </Form.Field>

                    <Form.Field className="flex flex-col" name="email">
            <Form.Label className="text-gray-900 dark:text-gray-300 font-medium">Account Type</Form.Label><br/>
            <Form.Control asChild>
              <input className="w-full p-3 border rounded-md bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500" type="email" required placeholder={user?.role} disabled />
            </Form.Control>
            <Form.Message className="text-red-500 text-sm" match="valueMissing">Please enter your email</Form.Message>
            <Form.Message className="text-red-500 text-sm" match="typeMismatch">Please provide a valid email</Form.Message>
          </Form.Field>

          {/* Question Field */}
    {/*      <Form.Field className="flex flex-col" name="question">
            <Form.Label className="text-gray-900 dark:text-gray-300 font-medium">Question</Form.Label>
            <Form.Control asChild>
              <textarea className="w-full p-3 h-24 border rounded-md bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500" required />
            </Form.Control>
            <Form.Message className="text-red-500 text-sm" match="valueMissing">Please enter a question</Form.Message>
          </Form.Field>*/}

          {/* Submit Button */}
          <Form.Submit asChild>
            <Link to="/accounts/settings">
            <button className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-md transition" >
              Change Password
            </button>
            </Link>
          </Form.Submit>

        </Form.Root>
      </Box>
    </div>
  );
}

export default ArtSettings;
