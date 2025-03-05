"use client";


import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { socket } from "@/socket";
import { useRouter } from "next/navigation";
import axios from "axios";
import { SubmitHandler, FieldValues } from 'react-hook-form';


interface ConversationMessage {
  sender: string;
  message: string;
}

const DoctorRegistration = () => {
  const [dorData, setDorData] = useState<FieldValues | undefined>(undefined);
  const [userInput, setUserInput] = useState(String);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [countdown, setCountdown] = useState(120); // Countdown starts from 120 seconds
  const [showPopup, setShowPopup] = useState(false);
  const [isTimerEnded, setIsTimerEnded] = useState(false); // Track if the timer ended
  const [isSubmitting, setIsSubmitting] = useState(false); // Track if the form is being submitted

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (isSubmitting) return; // Prevent resubmission if already submitting

    setIsSubmitting(true); // Disable the register button during submission

    console.log("Doctor Registration Data:", data);
    setDorData(data)
    const doctorData = JSON.stringify(data, null, 2);
    setConversation([{ sender: "doctor", message: doctorData }]);

    // Emit doctor registration prompt to the server
    socket.emit("doctor-regi", { prompt: doctorData });

    // Listen for the first response from the server
    socket.once("doctor-test", ({ response }) => {
      console.log("This is the initial response from AI:", response);
      setConversation((prev) => [...prev, { sender: "ai", message: response }]);
      startConversationTimer();
    });
  };

  const startConversationTimer = () => {
    setShowPopup(true);

    // Countdown timer logic
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setIsTimerEnded(true);
          return 0;
        }
        return prev - 1;
      });
    }, 400);

    setTimeout(() => {
      clearInterval(countdownInterval);
      setIsTimerEnded(true);
    }, 30000);
  };

  const handleUserResponse = () => {
    if (!userInput.trim()) return; // Don't send empty input
    if (isTimerEnded) return; // Prevent sending if the timer has ended

    // Add the user's input to the conversation
    setConversation((prev) => [
      ...prev,
      { sender: "user", message: userInput },
    ]);

    // Emit the user's response as the new prompt for the AI
    socket.emit("doctor-regi", { prompt: userInput });

    // Clear the user input field
    setUserInput(String);

    // Wait for the AI response
    socket.once("doctor-test", ({ response }) => {
      console.log("AI Response:", response);
      setConversation((prev) => [
        ...prev,
        { sender: "ai", message: response },
      ]);
    });
  };

  const handleProceedRegistration = async () => {

    const data = JSON.stringify(conversation, null, 2)

    socket.emit("test-doctor", { data });
    socket.on("doctor-result", async ({ response }) => {
      try {
        const stringResponse = typeof response === "string" ? response : JSON.stringify(response);
        const updatedResponse1 = stringResponse.replace(/```/g, '').trim();
        const updatedResponse = updatedResponse1.replace("json", '').trim();
        console.log("Cleaned response:", updatedResponse);
        const parsedResponse = JSON.parse(updatedResponse);
        console.log("Parsed response:", parsedResponse);
        const resultDesc = parsedResponse.dr.description;
        if (parsedResponse.dr.status === false) {
          const doctor = await axios.post('/api/doctor', { dorData, resultDesc });
          console.log(doctor)
          const name = dorData?.name.replace(/\s+/g, '').toLowerCase();
          if (name) {
            alert('you are no qualified enough');
            router.push(`http://dr${name}.localhost:3000`); // Correct the URL structure
          }
          alert('you are no qualified enough');
          router.push(`http://dr${name}.localhost:3000`); // Correct the URL structure
          // router.push('/');
        } else {
        }
      } catch (error) {
        console.error("Error processing response:", error);
      }
    });

  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col bg-gray-100 p-4 sm:p-6 lg:p-8"
    >
      <div className="w-full max-w-3xl mx-auto flex-grow bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 space-y-4">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-800 text-center">
          Doctor Registration
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-gray-600 font-medium mb-2">Name</label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter full name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {typeof errors.name.message === 'string' ? errors.name.message : 'Error occurred'}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-600 font-medium mb-2">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {typeof errors.email.message === 'string' ? errors.email.message : 'Error occurred'}
              </p>
            )}
          </div>

          {/* Specialization */}
          <div>
            <label className="block text-gray-600 font-medium mb-2">Specialization</label>
            <input
              type="text"
              {...register("specialization", { required: "Specialization is required" })}
              className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter specialization"
            />
            {errors.specialization && (
              <p className="text-red-500 text-sm mt-1">
                {typeof errors.specialization.message === 'string' ? errors.specialization.message : 'Error occurred'}
              </p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-gray-600 font-medium mb-2">Location</label>
            <input
              type="text"
              {...register("location", { required: "Location is required" })}
              className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter location"
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">
                {typeof errors.location.message === 'string' ? errors.location.message : 'Error occurred'}
              </p>
            )}
          </div>

          {/* Experience */}
          <div>
            <label className="block text-gray-600 font-medium mb-2">Experience</label>
            <input
              type="number"
              {...register("experience", { required: "Experience is required" })}
              className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter experience in years"
            />
            {errors.experience && (
              <p className="text-red-500 text-sm mt-1">
                {typeof errors.experience.message === 'string' ? errors.experience.message : 'Error occurred'}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-gray-600 font-medium mb-2">Phone Number</label>
            <input
              type="text"
              {...register("phone", { required: "Phone number is required" })}
              className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter phone number"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {typeof errors.phone.message === 'string' ? errors.phone.message : 'Error occurred'}
              </p>
            )}
          </div>

          {/* Qualifications */}
          <div>
            <label className="block text-gray-600 font-medium mb-2">Qualifications</label>
            <input
              type="text"
              {...register("qualifications", { required: "Qualifications are required" })}
              className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter qualifications"
            />
            {errors.qualifications && (
              <p className="text-red-500 text-sm mt-1">
                {typeof errors.qualifications.message === 'string' ? errors.qualifications.message : 'Error occurred'}
              </p>
            )}
          </div>

          {/* Login Code */}
          <div>
            <label className="block text-gray-600 font-medium mb-2">Login Code</label>
            <input
              type="text"
              {...register("loginCode", {
                required: "Login code is required",
                pattern: {
                  value: /^\d{4}$/,
                  message: "Login code must be 4 digits",
                },
              })}
              className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter 4-digit login code"
            />
            {errors.loginCode && (
              <p className="text-red-500 text-sm mt-1">
                {typeof errors.loginCode.message === 'string' ? errors.loginCode.message : 'Error occurred'}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-full p-3 bg-blue-500 text-white font-semibold rounded-md shadow-md"
          >
            Register Doctor
          </motion.button>
        </form>


        {/* Pop-up conversation section */}
        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div
              className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 space-y-4"
              style={{ maxHeight: "85%", overflowY: "auto" }} // Adjusted height and scrollability
            >
              <h3 className="text-xl font-semibold mb-4">Doctor Registration in Progress</h3>
              <p className="mb-4">This conversation will last for {countdown} seconds.</p>
              <div
                className="h-full overflow-y-auto border border-gray-300 p-4 rounded-lg space-y-4"
                style={{ backgroundColor: "#f9f9f9" }}
              >
                {conversation
                  .filter((msg) => msg.sender !== "doctor") // Don't show user details
                  .map((msg, index) => (
                    <div key={index} className={msg.sender === "user" ? "text-right" : "text-left"}>
                      <p
                        className={`px-4 py-2 rounded-lg ${msg.sender === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-800"
                          }`}
                      >
                        {msg.message}
                      </p>
                    </div>
                  ))}
              </div>
              <div className="mt-4">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="w-full p-3 border rounded-md shadow-sm"
                  placeholder="Type your response..."
                  disabled={isTimerEnded} // Disable input when the timer ends
                />
                <button
                  onClick={handleUserResponse}
                  className="mt-2 w-full p-3 bg-blue-500 text-white font-semibold rounded-md"
                  disabled={isTimerEnded} // Disable button when the timer ends
                >
                  Send Response
                </button>
              </div>
              {isTimerEnded ? (
                <div className="w-full bg-green-100 text-green-800 p-4 rounded-lg shadow-lg mt-6">
                  <button
                    onClick={handleProceedRegistration}
                    className="w-full p-3 bg-green-500 text-white font-semibold rounded-md shadow-md transition-transform transform active:scale-95"
                  >
                    Proceed Registration
                  </button>

                </div>
              ) : null}
            </div>
          </div>
        )}


        {/* Completion message or Proceed Registration button */}
      </div>
    </motion.div>
  );
};

export default DoctorRegistration;


