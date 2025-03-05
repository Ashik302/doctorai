"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import UserProfile from "../Components/Userprofile";


interface UserData {
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
  Address: string;
  symptom?: Case[];
  appointment?: Appointment[];
}

interface Case {
  summery: string;
  review?: Review[];
}

interface Review {
  content: string;
  voteCount: number;
}

interface Appointment {
  date: string;
  time: string;
  reason?: string;
  status: string;
  doctor: Doctor;
}

interface Doctor {
  name: string;
}

const Dashboard = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("dot_user") || "{}");
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/user/${storedUser.userId}`);
        setUserData(response.data);
        console.log("this is the data", response.data)
      } catch (error) {
        console.error("Error fetching user data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);



  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-200 p-6 space-y-8 margin-auto w-85%">
      {/* Dashboard Heading */}
      <h1 className="text-3xl font-bold text-gray-700 mb-6">Dashboard</h1>

      {/* User Profile */}
      <div className="rounded-lg p-6 shadow-lg bg-gradient-to-r from-blue-50 to-blue-100">
        {userData && (
          <UserProfile {...userData} />
        )}

      </div>

      {/* Previous Cases (Symptoms) Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Previous Cases</h2>
        {userData?.symptom?.map((caseItem, index) => (
          <div
            key={index}
            className="p-6 mb-6 bg-gray-50 border-l-4 border-blue-500 rounded-lg"
          >
            <p className="text-gray-600 mb-3">
              <strong>Summary:</strong> {caseItem.summery}
            </p>
            {caseItem.review?.map((review, i) => (
              <p key={i} className="text-gray-600">
                <strong>Review:</strong> {review.content} (Votes: {review.voteCount})
              </p>
            ))}
          </div>
        ))
        }
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Appointments</h2>
        {userData?.appointment?.map((appointment, index) => (
          <div
            key={index}
            className="p-6 mb-6 bg-gray-50 border-l-4 border-blue-500 rounded-lg"
          >
            <p className="text-gray-600 mb-3">
              <strong>Date:</strong> {appointment.date}
            </p>
            <p className="text-gray-600 mb-3">
              <strong>Time:</strong> {appointment.time}
            </p>
            <p className="text-gray-600 mb-3">
              <strong>Reason:</strong> {appointment.reason || "Not Provided"}
            </p>
            <p className="text-gray-600 mb-3">
              <strong>Status:</strong> {appointment.status}
            </p>
            <p className="text-gray-600">
              <strong>Doctor:</strong> {appointment.doctor.name}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Dashboard;
