"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";

// Define the doctor type
interface Doctor {
  id: string;
  name: string;
  specialization: string;
  qualification: string;
  image?: string;
}

export default function RegisteredDoctorPage() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<Doctor[]>([]); // Explicitly type doctors state as an array of Doctor objects
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchName, setSearchName] = useState("");
  const [searchField, setSearchField] = useState("");
  
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null); // Track the selected doctor

  // Fetch doctor data using Axios
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("/api/doctor");
        console.log("API Response:", response); // Debugging log
        setDoctors(Array.isArray(response.data) ? response.data : []); // Ensure it's an array
        setLoading(false);
      } catch (err) {
        console.error("API Error:", err); // Debugging log
        setError("Failed to fetch doctor data.");
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Filter logic
  const filteredDoctors = Array.isArray(doctors)
    ? doctors.filter((doctor) => {
        const matchesName = doctor.name.toLowerCase().includes(searchName.toLowerCase());
        const matchesField = searchField === "" || doctor.specialization === searchField;
        return matchesName && matchesField;
      })
    : [];

  // Redirect to registration page
  const handleRegisterClick = () => {
    router.push("/doctor-registration");
  };

  // Redirect to individual doctor profile
  const handleDoctorClick = (doctorId: string) => {
    setSelectedDoctorId(doctorId); // Set the clicked doctor as selected
    router.push(`/registered-doctor/${doctorId}`);
  };

  return (
    <div className="py-16 px-4">
      <h1 className="text-3xl font-semibold text-center mb-8">Search Registered Doctors</h1>

      {/* Loading and Error States */}
      {loading && <p className="text-center text-gray-500">Loading doctors...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          {/* Search Section */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
            {/* Search by Name */}
            <input
              type="text"
              placeholder="Search by Name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="px-4 py-2 border rounded-md w-full md:w-auto"
            />

            {/* Filter by Field */}
            <select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              className="px-4 py-2 border rounded-md w-full md:w-auto"
            >
              <option value="">All Fields</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurologist">Neurologist</option>
              <option value="Pediatrician">Pediatrician</option>
              <option value="Orthopedist">Orthopedist</option>
              <option value="Dermatologist">Dermatologist</option>
              <option value="Surgeon">Surgeon</option>
            </select>
          </div>

          {/* Doctors List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                onClick={() => handleDoctorClick(doctor.id)}
                className={`flex border p-6 rounded-md shadow-md hover:shadow-lg transition-shadow cursor-pointer ${
                  selectedDoctorId === doctor.id
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                    : "bg-white text-gray-800"
                }`}
              >
                {/* Doctor Profile on the left */}
                <div className="w-1/3 flex justify-center items-center">
                  <Image
                    src={doctor.image || "/default-doctor.png"} // Fallback image
                    alt={doctor.name}
                    width={128}
                    height={128}
                    className="w-32 h-32 rounded-full"
                  />
                </div>

                {/* Doctor Details on the right */}
                <div className="w-2/3 pl-6 flex flex-col justify-center">
                  <h3 className="text-xl font-semibold text-blue-700">{doctor.name}</h3>
                  <p className="text-gray-600">{doctor.specialization}</p>
                  <p className="text-gray-600">{doctor.qualification}</p>
                  <div className="mt-4">
                    <button
                      onClick={() => handleDoctorClick(doctor.id)}
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-md hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-700 transition-colors"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredDoctors.length === 0 && (
            <p className="text-center text-gray-500 mt-8">No doctors found. Try refining your search.</p>
          )}

          {/* Register as a Doctor */}
          <div className="text-center mt-12">
            <button
              onClick={handleRegisterClick}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-md hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-700 transition-colors"
            >
              Register as a Doctor
            </button>
          </div>
        </>
      )}
    </div>
  );
}
