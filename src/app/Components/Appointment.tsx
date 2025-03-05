"use client";

import React from "react";
import { motion } from "framer-motion";

interface Appointment {
  date: string;
  time: string;
  status: string;
  reason: string;
  doctor: { name: string; specialty: string };
}

interface AppointmentPopupProps {
  appointment: Appointment;
  onClose: () => void;
}

const AppointmentPopup: React.FC<AppointmentPopupProps> = ({ appointment, onClose }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          Appointment Details
        </h2>
        <div className="text-center mb-4">
          <p className="text-gray-600">
            <strong>Date:</strong> {appointment.date} at {appointment.time}
          </p>
          <p className="text-gray-600">
            <strong>Status:</strong> {appointment.status}
          </p>
          {appointment.reason && (
            <p className="text-gray-600">
              <strong>Reason:</strong> {appointment.reason}
            </p>
          )}
          <p className="text-gray-600">
            <strong>Doctor:</strong> {appointment.doctor.name} ({appointment.doctor.specialty})
          </p>
        </div>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Close
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Reschedule
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AppointmentPopup;
