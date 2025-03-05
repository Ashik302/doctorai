"use client";

import React, { useState, useEffect } from "react";
import { AiOutlineLike } from "react-icons/ai";
import axios from "axios";
import { AxiosError } from "axios";

interface ReviewProps {
  doctorName: string;
  degree: string;
  specialization: string;
  content: string;
  doctorId: string;
  reviewId: string;
  voteCount: number;
  createdById: { createdById: string }[]; // Assuming createdById is an array of objects with a `createdById` field
}

const Review = ({
  doctorName,
  degree,
  specialization,
  content,
  doctorId,
  reviewId,
  voteCount,
  createdById,
}: ReviewProps) => {
  const [likeCount, setLikeCount] = useState(voteCount); // Initialize with the passed prop
  const [status, setStatus] = useState(false); // Indicates if the doctor has already liked

  // Check if the doctor has liked the review initially
  useEffect(() => {
    if (createdById.length !== 0) {
      const liked = createdById.some((id) => id.createdById === doctorId);
      setStatus(liked);
    }
  }, [createdById, doctorId]);

  const handleLike = async () => {
    // Optimistically update the UI
    const newStatus = !status;
    const newLikeCount = newStatus ? likeCount + 1 : likeCount - 1;

    setStatus(newStatus); // Toggle the like status
    setLikeCount(newLikeCount); // Update like count optimistically

    try {
      // Send the request to the backend
      await axios.patch(`/api/review/${reviewId}`, {
        doctorId,
        reviewId,
      });
    } catch (error) {
  // Type cast error as AxiosError
  const axiosError = error as AxiosError;
  
  // If there's an error, revert the optimistic changes
  console.error("Error updating like:", axiosError.response?.data || axiosError.message);   
  setStatus(!newStatus); // Revert to the previous status
  setLikeCount(newLikeCount - (newStatus ? 1 : -1));    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-lg text-sm">
          {specialization}
        </div>
      </div>

      {/* Doctor Info */}
      <div className="mt-2">
        <p className="text-lg font-semibold text-gray-800">{doctorName}</p>
        <p className="text-sm text-gray-500">{degree}</p>
      </div>

      {/* Review Content */}
      <div className="mt-3">
        <p className="text-gray-700">{content}</p>
      </div>

      {/* Like Section */}
      <div className="mt-4 flex items-center space-x-6">
        <button
          className={`flex items-center space-x-2 ${
            status ? "text-green-600" : "text-gray-500"
          } hover:scale-110 transition transform`}
          onClick={handleLike}
        >
          <AiOutlineLike size={24} />
          <span>{likeCount}</span>
        </button>
      </div>
    </div>
  );
};

export default Review;
