"use client";
import animationData from "./../../public/AD.json";
import dynamic from "next/dynamic";
// import Lottie from "react-lottie-player";
import Link from "next/link";
import RegisteredDoctors from "./Components/Doctor";
import { motion } from "framer-motion";

const Lottie = dynamic(() => import("react-lottie-player"), { ssr: false });

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="container t-20 min-h-screen flex flex-col w-full md:w-[85%] mx-auto"
    >
      <br />

      {/* Hero Section */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex-grow flex items-center pt-24"
      >
        <div className="flex flex-col md:flex-row items-center w-full">
          {/* Left Content */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-left md:w-1/2 space-y-4 px-4 md:px-0"
          >
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-pink-500 to-purple-600 text-transparent bg-clip-text">
              Revolutionizing Healthcare with AI
            </h2>
            <p className="text-gray-600 text-lg">
              Empowering patients and healthcare providers with intelligent tools to enhance diagnostics, triage, and resource management.
            </p>
            <br />
            <a
              href="/patient-form"
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-blue-600 text-white font-semibold rounded-md shadow-md hover:shadow-lg hover:scale-105 transition-all"
            >
              Get Started
            </a>
          </motion.div>

          {/* Right Content (Animation) */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full md:w-1/2 flex justify-center mt-8 md:mt-0"
          >
            <Lottie
              loop
              animationData={animationData}
              play
              style={{ width: "100%", height: "auto", maxWidth: 300 }}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
        id="features"
        className="w-full py-16 bg-gradient-to-r from-blue-50 to-pink-50 shadow-md mt-10"
      >
        <div className="mx-auto px-4">
          <h3 className="text-3xl font-bold text-blue-700 mb-6 text-center">
            Key Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[{
              title: "Chat with Doctor AI",
              description:
                "Engage with Doctor AI for personalized healthcare advice in a conversational and interactive experience.",
              link: "/chat_with_doctor_AI",
            },
            {
              title: "Nearby Clinics",
              description:
                "Locate nearby doctors and pharmacies based on your current location.",
              link: "/nearby-clinics",
            },
            {
              title: "Patient Dashboard",
              description:
                "Comprehensive dashboards for providers to track and manage patient cases.",
              link: "/patient-dashboard",
            }].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Link href={feature.link}>
                  <div className="bg-white p-6 rounded-md shadow hover:shadow-lg transition-all cursor-pointer">
                    <h4 className="text-xl md:text-2xl font-semibold text-blue-700">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600 mt-4">{feature.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Doctors Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <RegisteredDoctors />
      </motion.div>
    </motion.div>
  );
}




