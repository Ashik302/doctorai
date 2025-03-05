"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaUserCheck } from "react-icons/fa";
import axios from "axios";

interface Appointment {
  id: string;
  patientName: string;
  time: string;
  date: string;
  status: string;
  reason?: string; 
  userId: string;
}

interface AppointmentsSectionProps {
  appointment: Appointment[];
  doctorName: string; // Doctor's name for email content
  doctorId: string;
}

export default function AppointmentsSection({
  appointment,
  doctorName,
  doctorId
}: AppointmentsSectionProps) {
  const [appointments, setAppointments] = useState<Appointment[]>(appointment || []);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>(appointment || []);
  const [filterDate, setFilterDate] = useState<string>("");
  const [declineModal, setDeclineModal] = useState<{ show: boolean; appointmentId: string }>({
    show: false,
    appointmentId: "",
  });
  const [declineReason, setDeclineReason] = useState<string>("");
  const [newDate, setNewDate] = useState<string>("");

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterDate(e.target.value);
    const filtered = appointments.filter(
      (appointment) => appointment.date === e.target.value
    );
    setFilteredAppointments(filtered);
  };

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

  const handleAction = async (id: string, action: "accept" | "decline") => {
    const appointment = appointments.find((appt) => appt.id === id);
    if (!appointment) return;

    try {
      if (action === "accept") {
        const response = await axios.patch("/api/appointment", {
          id,
          action: "accept",
          newDate,
        });

        console.log(response);

        setAppointments((prev) =>
          prev.map((appt) =>
            appt.id === id ? { ...appt, status: "Accepted" } : appt
          )
        );
        setFilteredAppointments((prev) =>
          prev.map((appt) =>
            appt.id === id ? { ...appt, status: "Accepted" } : appt
          )
        );

        const subject = "Your Appointment is Confirmed";
        const content = `
          Hey there,

          the appointment with Dr. ${doctorName} on ${appointment.date} at ${appointment.time} has been confirmed.

          Thank you,
          Appointment Management Team
          doctorai!
        `;
        await sendEmail(appointment.userId, doctorId, subject, content);
      } else if (action === "decline") {
        const response = await axios.patch("/api/appointment", {
          id,
          action: "postpone",
          newDate,
          reason: declineReason,
        });

        console.log(response);

        setAppointments((prev) =>
          prev.map((appt) =>
            appt.id === id
              ? { ...appt, status: "Postponed", date: newDate, reason: declineReason }
              : appt
          )
        );
        setFilteredAppointments((prev) =>
          prev.map((appt) =>
            appt.id === id
              ? { ...appt, status: "Postponed", date: newDate, reason: declineReason }
              : appt
          )
        );

        const subject = "Your Appointment is Postponed";
        const content = `
          Hey there,

          Unfortunately, Dr. ${doctorName} is unavailable for your appointment on ${appointment.date} at ${appointment.time}.

          Reason: ${declineReason}
          New Appointment Date: ${newDate}

          Please confirm your availability or request a new date.

          Thank you,
          Appointment Management Team
        `;
        await sendEmail(appointment.userId, doctorId, subject, content);

        setDeclineModal({ show: false, appointmentId: "" });
        setDeclineReason("");
        setNewDate("");
      }
    } catch (error) {
      console.error(`Error ${action === "accept" ? "accepting" : "declining"} appointment:`, error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <motion.h1
        className="text-2xl sm:text-3xl font-bold text-black mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Appointments
      </motion.h1>

      {/* Filter by Date */}
      <div className="mb-6 text-center">
        <label className="text-gray-700 font-medium mr-2" htmlFor="filterDate">
          Filter by Date:
        </label>
        <input
          id="filterDate"
          type="date"
          value={filterDate}
          onChange={handleFilterChange}
          className="border rounded px-3 py-2"
        />
      </div>

      {/* Appointments Grid */}
      {filteredAppointments.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAppointments.map((appointment) => (
            <motion.div
              key={appointment.id}
              className="bg-white rounded-lg shadow-lg p-4 flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center space-x-4 mb-4">
                <FaUserCheck className="text-purple-500 text-3xl" />
                <div>
                  <p className="font-semibold text-black text-lg">{appointment.patientName}</p>
                  <p className="text-gray-600">Time: {appointment.time}</p>
                  <p className="text-gray-500 text-sm">Date: {appointment.date}</p>
                  <p className="text-gray-500 text-sm">Status: {appointment.status}</p>
                  <p className="text-gray-500 text-sm">Reason: {appointment.reason || "N/A"}</p>
                </div>
              </div>
              <div className="flex justify-between mt-4">
                <button
                  className={`px-4 py-2 rounded font-medium ${appointment.status === "Accepted"
                    ? "bg-gray-400 text-white opacity-50 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                  onClick={() => handleAction(appointment.id, "accept")}
                  disabled={appointment.status === "Accepted"}
                >
                  Accept
                </button>
                <button
                  className={`px-4 py-2 rounded font-medium ${appointment.status === "Accepted" || appointment.status === "Postponed"
                    ? "bg-gray-400 text-white opacity-50 cursor-not-allowed"
                    : "bg-purple-500 hover:bg-purple-600 text-white"
                    }`}
                  onClick={() => setDeclineModal({ show: true, appointmentId: appointment.id })}
                  disabled={appointment.status === "Accepted" || appointment.status === "Postponed"}
                >
                  Decline
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">No appointments available.</div>
      )}

      {/* Decline Modal */}
      {declineModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Decline Appointment</h2>
            <label className="block text-gray-700 mb-2" htmlFor="reason">
              Reason:
            </label>
            <textarea
              id="reason"
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              className="w-full border rounded p-2 mb-4"
              placeholder="Enter reason for declining"
            />
            <label className="block text-gray-700 mb-2" htmlFor="newDate">
              Suggested New Date:
            </label>
            <input
              id="newDate"
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full border rounded p-2 mb-4"
            />
            <div className="flex justify-end">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
                onClick={() => setDeclineModal({ show: false, appointmentId: "" })}
              >
                Cancel
              </button>
              <button
                className="bg-purple-500 text-white px-4 py-2 rounded"
                onClick={() => handleAction(declineModal.appointmentId, "decline")}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
