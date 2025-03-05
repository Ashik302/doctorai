"use client";


import { useForm } from 'react-hook-form';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import axios from "axios";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';


type FormData = {
  name: string;
  email: string;
  phone: string;
  address: string;
};


export default function PatientForm() {
  const router = useRouter();
  
  useEffect(() => {
    const user = localStorage.getItem("dot_user");

    if (user) {
      router.replace("/patient-dashboard"); // Redirect if user exists
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    console.log('Form Data:', data);
    const status = "sign"
    try {
      const response = await axios.post("/api/user",  {data, status} )
      console.log("this is the response from backend", response.data);
      if(response.status === 200){
        localStorage.setItem("dot_user", JSON.stringify(response.data))
      }
    } catch (error) {
      console.log("error adding the data", error);
    }
  };

  const [mainRef, mainInView] = useInView({ triggerOnce: true, threshold: 0.3 });

  const fadeInVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <motion.main
        ref={mainRef}
        variants={fadeInVariants}
        initial="hidden"
        animate={mainInView ? 'visible' : 'hidden'}
        className="container mx-auto px-4 mt-10"
      >
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-pink-500 to-purple-600 text-transparent bg-clip-text text-center">
            Patient Information Form
          </h2>
          <p className="text-gray-600 text-center mt-4">
            Please fill out the form below to get started with your consultation.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} role="form" className="space-y-6 mt-6">
            <div>
              <label htmlFor="name" className="block text-lg font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                {...register('name', { required: 'Full name is required.' })}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-2">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-lg font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                {...register('email', {
                  required: 'Email is required.',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Enter a valid email address.',
                  },
                })}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-2">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-lg font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                {...register('phone', {
                  required: 'Phone number is required.',
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Enter a valid 10-digit phone number.',
                  },
                })}
                placeholder="Enter your phone number"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              {errors.phone && (
                <p className="text-sm text-red-500 mt-2">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="address" className="block text-lg font-medium text-gray-700">
                Address
              </label>
              <textarea
                id="address"
                {...register('address', { required: 'Address is required.' })}
                placeholder="Enter your address"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              {errors.address && (
                <p className="text-sm text-red-500 mt-2">{errors.address.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-blue-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all"
            >
              Submit
            </button>
          </form>
        </div>
      </motion.main>
    </div>
  );
}
