"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image";



interface Doctor {
  id: string;
  name: string;
  email: string;
  location: string;
  experience: number;
  phoneNumber: string;
  specialization: string;
  qualification: string;
  resultDesc: string;
}


export default function DoctorPage({ params }: { params: Promise<{ id: string }> }) {

  const { id: doctorId } = use(params);

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointmentData, setAppointmentData] = useState({
    date: "",
    time: "",
    patientName: "",
    patientEmail: "",
    patientNumber: "",
    cause: "",
  });

  const router = useRouter();

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(`/api/doctor/${doctorId}`);
        setDoctor(response.data);
      } catch (err) {
        console.error("Error fetching doctor:", err);
        setError("Failed to fetch doctor details");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [doctorId]);

  const handleBookingClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('dot_user');
    if (storedUser) {
      const { userId } = JSON.parse(storedUser);
      setUserId(userId);
    }
  }, []); // This ensures it only runs on the client side after the component mounts

  const sendEmail = async (
    userId: string,
    doctorId: string, 
    subject: string,
    content: string
  ) => {
    try {
      await axios.post("/api/sendEmail", {
        userId,
        doctorId, 
        subject,
        content,
      });
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  };
  
  
  const handleAppointmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!userId) {
      alert("User is not logged in.");
      return;
    }
  
    if (!doctor?.id) {
      alert("Doctor ID is missing.");
      return;
    }
  
    try {
      const response = await axios.post("/api/appointment", {
        appointmentData,
        doctorId: doctor.id, // ✅ Sending doctorId
        userId,
      });
  
      alert("Appointment booked successfully! YOU WILL BE NOTIFIED AFTER DOCTOR PROCEED!");
      console.log(response);
      setIsModalOpen(false);
  
      const subject = "Requested Appointment";
      const content = `
      Hey there,  
      
      A new appointment request has been submitted.  
      
      **Appointment Details:**  
      - **Doctor:** ${doctor.name}  
      - **Date & Time:** ${response.data.date} at ${response.data.time}  
      - **Reason:** ${response.data.reason}  
      
      For the doctor: Please review and proceed with the appointment.  
      For the patient: You will be notified once the doctor reviews your request.  
      
      Best regards,  
      [Your Clinic/Hospital Name]  
      `;
  
      await sendEmail(userId, doctor.id, subject, content); // ✅ Pass doctorId instead of email
      router.push("/");
    } catch (error) {
      console.log(error);
      alert("Failed to book appointment. Please try again.");
    }
  };
  


  if (loading) {
    return (
      <div className="text-center mt-16">
        <motion.div
          className="animate-pulse space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="bg-gray-300 h-32 w-32 rounded-full mx-auto"></div>
          <div className="bg-gray-300 h-6 w-3/4 mx-auto"></div>
          <div className="bg-gray-300 h-6 w-1/2 mx-auto"></div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-16">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => router.push("/registered-doctor")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Back to Doctors
        </button>
      </div>
    );
  }

  return (
    <div className="py-20 px-4">
      <h1 className="text-3xl font-semibold text-center mb-12 text-gradient">Doctor Details</h1>
      <div className="max-w-4xl mx-auto border p-6 rounded-md shadow-md grid grid-cols-2 gap-8">
        {/* Left: Doctor Profile */}
        <div className="flex flex-col items-center">
          <Image
            src={`/${doctor?.id}.png`}
            alt={doctor ? doctor.name : 'image'}
            width={128}
            height={128}
            className="w-32 h-32 rounded-full mb-6 border-4 border-purple-500"
          />

          <h2 className="text-2xl font-bold text-blue-700 mb-2">{doctor?.name}</h2>
          <p className="text-xl font-semibold text-purple-600">{doctor?.specialization}</p>
        </div>

        {/* Right: Doctor Details */}
        <div className="text-gray-700 space-y-4">
          <p><strong>Email:</strong> {doctor?.email}</p>
          <p><strong>Phone:</strong> {doctor?.phoneNumber}</p>
          <p><strong>Location:</strong> {doctor?.location}</p>
          <p><strong>Experience:</strong> {doctor?.experience} years</p>
          <p><strong>Qualification:</strong> {doctor?.qualification}</p>
          <p><strong>Additional Info:</strong> {doctor?.resultDesc}</p>
        </div>
      </div>

      {/* Booking Button */}
      <div className="text-center mt-8">
        <button
          onClick={handleBookingClick}
          className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full shadow-md transform transition-all hover:scale-105"
        >
          Book an Appointment
        </button>
      </div>

      {/* Booking Modal */}
      {isModalOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white p-6 rounded-lg shadow-2xl max-w-lg w-full transform scale-100"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">
              Book an Appointment
            </h2>
            <form onSubmit={handleAppointmentSubmit} className="space-y-4">
              <div className="flex space-x-4">
                <div className="w-1/2">
                  <label htmlFor="patientName" className="block text-gray-700 font-medium">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="patientName"
                    value={appointmentData.patientName}
                    onChange={(e) =>
                      setAppointmentData({
                        ...appointmentData,
                        patientName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="w-1/2">
                  <label htmlFor="phoneNumber" className="block text-gray-700 font-medium">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    value={appointmentData.patientNumber}
                    onChange={(e) =>
                      setAppointmentData({
                        ...appointmentData,
                        patientNumber: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="patientEmail" className="block text-gray-700 font-medium">
                  Your Email
                </label>
                <input
                  type="email"
                  id="patientEmail"
                  value={appointmentData.patientEmail}
                  onChange={(e) =>
                    setAppointmentData({
                      ...appointmentData,
                      patientEmail: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="appointmentCause" className="block text-gray-700 font-medium">
                  Appointment Cause
                </label>
                <textarea
                  id="appointmentCause"
                  value={appointmentData.cause}
                  onChange={(e) =>
                    setAppointmentData({
                      ...appointmentData,
                      cause: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
              </div>
              <div className="flex space-x-4">
                <div className="w-1/2">
                  <label htmlFor="date" className="block text-gray-700 font-medium">
                    Appointment Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={appointmentData.date}
                    onChange={(e) =>
                      setAppointmentData({
                        ...appointmentData,
                        date: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="w-1/2">
                  <label htmlFor="time" className="block text-gray-700 font-medium">
                    Appointment Time
                  </label>
                  <input
                    type="time"
                    id="time"
                    value={appointmentData.time}
                    onChange={(e) =>
                      setAppointmentData({
                        ...appointmentData,
                        time: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition duration-200"
                >
                  Book Appointment
                </button>
              </div>
            </form>
            <div className="text-center mt-4">
              <button
                onClick={handleModalClose}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-200"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
