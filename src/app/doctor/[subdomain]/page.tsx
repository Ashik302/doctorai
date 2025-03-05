"use client";


import axios from 'axios';
import { useState } from 'react';
import DoctorProfile from './components/DoctorPro';

export default function AuthDoctor() {
  const [email, setEmail] = useState('');
  const [loginCode, setLoginCode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [doctorData, setDoctorData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const authenticateDoctor = async () => {
    console.log('this is the data', email, loginCode)
    try {
      const response = await axios.post('/api/subdomainDoctorAuth', { email, loginCode });
      console.log(response)
      if (response.status === 200) {
        setIsAuthenticated(true);
        setDoctorData(response.data);
        setErrorMessage('');
      } else {
        setErrorMessage('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Error authenticating doctor:', error);
      setErrorMessage('An error occurred. Please try again later.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Doctor Authentication</h2>
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Login Code:</label>
            <input
              type="password"
              value={loginCode}
              onChange={(e) => setLoginCode(e.target.value)}
              className="w-full p-3 border rounded-lg"
              placeholder="Enter your login code"
              required
            />
          </div>
          {errorMessage && (
            <p className="text-red-600 text-sm">{errorMessage}</p>
          )}
          <button
            onClick={authenticateDoctor}
            className="w-full p-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
          >
            Authenticate
          </button>
        </div>
      </div>
    );
  }

  return (
    
    <div>
    {doctorData ? (
     <DoctorProfile doctorData={doctorData} />
    ) : (
      <p>No data available</p>
    )}
  </div>  );
}
