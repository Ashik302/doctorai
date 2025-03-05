"use client";


import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaCalendarAlt, FaFolderOpen } from 'react-icons/fa';
import AppointmentsSection from './Appointment';
import CasesSection from './Cases';
import Image from 'next/image';


interface DoctorData {
  name: string;
  qualification: string;
  email: string;
  location: string;
  specialization: string;
  experience: number;
  phoneNumber: string;
  loginCode: string;
  resultDesc: string;
  appointment: []; // Adjust the type based on the actual structure of appointment
  id: string;
}

export default function DoctorProfile({ doctorData }: { doctorData: DoctorData }) {
  console.log('this is  doctor data', doctorData)
  const [showAppointments, setShowAppointments] = useState(false);
  const [showCases, setShowCases] = useState(false);

  if (!doctorData) {
    return <div>Loading doctor information...</div>; // Handle undefined doctor
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-8 sm:px-8">
      {/* Profile Section */}
      <motion.div
        className="bg-white rounded-lg shadow-lg p-6 sm:p-8 max-w-4xl w-full"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start">
          {/* Profile Image */}
          <Image
            src="/doctor-placeholder.png"
            alt="Doctor"
            width={128}  // Set width
            height={128} // Set height
            className="sm:w-32 sm:h-32 rounded-full object-cover border-4 border-purple-500"
          />

          {/* Doctor Details */}
          <div className="sm:ml-6 mt-4 sm:mt-0 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-black">{doctorData.name}</h1>
            <p className="text-lg text-black">{doctorData.qualification}</p>
            <p className="text-sm text-gray-600">{doctorData.email}</p>
            <p className="text-sm text-gray-600">{doctorData.location}</p>
          </div>
        </div>

        {/* Doctor Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 text-black">
          <div>
            <h3 className="text-lg font-semibold">Specialization:</h3>
            <p>{doctorData.specialization}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Experience:</h3>
            <p>{doctorData.experience} years</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Phone Number:</h3>
            <p>{doctorData.phoneNumber}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Login Code:</h3>
            <p>{doctorData.loginCode}</p>
          </div>
          <div className="sm:col-span-2">
            <h3 className="text-lg font-semibold">Result Description:</h3>
            <p>{doctorData.resultDesc}</p>
          </div>
        </div>
      </motion.div>

      {/* Buttons Section */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4 mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <button
          onClick={() => {
            setShowAppointments(!showAppointments);
            if (showCases) setShowCases(false); // Close Cases if open
          }}
          className="flex items-center justify-center px-6 py-3 bg-purple-500 text-white font-semibold rounded-lg shadow-md hover:bg-purple-600 transition"
        >
          <FaCalendarAlt className="mr-2" />
          {showAppointments ? 'Close Appointments' : 'Appointments'}
        </button>
        <button
          onClick={() => {
            setShowCases(!showCases);
            if (showAppointments) setShowAppointments(false); // Close Appointments if open
          }}
          className="flex items-center justify-center px-6 py-3 bg-purple-500 text-white font-semibold rounded-lg shadow-md hover:bg-purple-600 transition"
        >
          <FaFolderOpen className="mr-2" />
          {showCases ? 'Close Cases' : 'View Cases'}
        </button>
      </motion.div>

      {/* Render Appointments Section */}
      {showAppointments && (
        <motion.div
          className="mt-6 w-full max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AppointmentsSection appointment={doctorData.appointment} doctorName={doctorData.name} doctorId={doctorData.id}/>
        </motion.div>
      )}

      {/* Render Cases Section */}
      {showCases && (
        <motion.div
          className="mt-6 w-full max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CasesSection specialization={doctorData.specialization} doctorId={doctorData.id} />
        </motion.div>
      )}
    </div>
  );
}
