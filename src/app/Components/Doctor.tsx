"use client";
import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function RegisteredDoctors() {
  const router = useRouter();

  const handleClicked = () => {
    console.log("Navigating to /registered-doctor");
    router.push('/registered-doctor');
  };

  // Doctors array defined outside useEffect or memoized to avoid re-creation
  const doctors = useMemo(
    () => [
      { name: "Dr. Smith", field: "Cardiologist", image: "/d1.png" },
      { name: "Dr. Jane", field: "Neurologist", image: "/d2.png" },
      { name: "Dr. Emily", field: "Pediatrician", image: "/d3.png" },
      { name: "Dr. Robert", field: "Orthopedist", image: "/d4.png" },
      { name: "Dr. Watson", field: "Dermatologist", image: "/d5.png" },
      { name: "Dr. Brown", field: "Surgeon", image: "/d6.png" },
    ],
    []
  );

  // Combine doctors array to loop seamlessly
  const [loopDoctors, setLoopDoctors] = useState<
    { name: string; field: string; image: string }[]
  >([]);

  useEffect(() => {
    // Double the doctors array to allow seamless animation
    setLoopDoctors([...doctors, ...doctors]);
  }, [doctors]); // `doctors` is stable due to useMemo

  return (
    <div className="overflow-hidden py-16">
      <h1 className="text-3xl font-semibold text-center mb-8">Our Registered Doctors</h1>

      <div className="relative">
        {/* Animated doctor profiles */}
        <motion.div
          className="flex gap-6"
          initial={{ x: 0 }}
          animate={{ x: -1000 }} // Adjust based on card width
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 20, // Speed of the animation
            ease: "linear",
          }}
        >
          {loopDoctors.map((doctor, index) => (
            <motion.div
              key={index}
              className="min-w-[300px] p-6 text-center"
              whileHover={{ scale: 1.05 }}
            >
            <Image
  src={doctor.image}
  alt={doctor.name}
  width={128}  // Equivalent to 32 * 4 for more control (32px * 4 = 128px)
  height={128} // Same height as width for a square image
  className="rounded-full mx-auto mb-4"
/>

              <h3 className="text-xl font-semibold text-blue-700">{doctor.name}</h3>
              <p className="text-gray-600">{doctor.field}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Button displayed outside animation */}
        <div className="text-center mt-8">
          <button
            onClick={handleClicked}
            className="px-6 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
