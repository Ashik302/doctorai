"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Review from "./Reviews";

interface Review {
  id: string;
  content: string;
  createdBy: {
    name: string;
    qualification: string;
    specialization: string;
  };
  voteCount: number;
  reviewVote: string;
}

interface CasesSectionProps {
  specialization: string;
  doctorId: string;
}

interface Case {
  caseId: string;
  symptomSummary: string;
  patientEmail: string;
  patientNumber: string;
  patientAddress: string;
  patientName: string;
}

export default function CasesSection({ specialization, doctorId }: CasesSectionProps) {
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCase, setExpandedCase] = useState<string | null>(null);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState<{ [key: string]: Review[] } | undefined>(undefined); // Specific type here
  const [loadingReviews, setLoadingReviews] = useState<{ [key: string]: boolean }>({}); // Ensure this is defined

  console.log("this is is ", doctorId);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/subdomainDoctorAuth/cases/${specialization}`);
        console.log('this hai this', response.data);
        setCases(response.data);
      } catch (err) {
        setError("Failed to fetch cases. Please try again later.");
        console.log("this error", err)
      } finally {
        setIsLoading(false);
      }
    };

    if (specialization) {
      fetchCases();
    }
  }, [specialization]);

  const handleShowMoreClick = (caseId: string) => {
    setExpandedCase((prev) => (prev === caseId ? null : caseId));
  };

  const handleReviewSubmit = async (caseId: string) => {
    if (!review) {
      alert('Please write a review before submitting.');
      return;
    }

    try {
      const response = await axios.post(`/api/review/${caseId}`, {
        content: review,
        doctorId: doctorId,
        symptomId: caseId,
      });
      console.log('Review Response:', response);
      if (response.status === 200) {
        alert('Review submitted successfully!');
        setReview('');
      } else {
        alert('Failed to submit the review.');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('An error occurred while submitting your review.');
    }
  };
  
  const handleViewReviews = async (caseId: string) => {
    // Check if reviews exist and caseId is present in reviews
    if (reviews && reviews[caseId]) {
      // Clear reviews for this caseId by setting it to an empty array
      setReviews((prev) => ({ ...prev, [caseId]: [] }));
      return;
    }
  
    setLoadingReviews((prev) => ({ ...prev, [caseId]: true }));
    try {
      const response = await axios.get(`/api/review/${caseId}`);
      console.log(response.data);
      setReviews((prev) => ({ ...prev, [caseId]: response.data }));
    } catch (err) {
      console.error("Error fetching reviews:", err);
      alert("Failed to fetch reviews. Please try again.");
    } finally {
      setLoadingReviews((prev) => ({ ...prev, [caseId]: false }));
    }
  };
  
  
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <motion.h1
        className="text-3xl sm:text-4xl font-bold text-purple-700 mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {specialization} Cases
      </motion.h1>

      {isLoading && (
        <div className="flex justify-center items-center text-gray-500">
          Loading cases...
        </div>
      )}
      {error && (
        <div className="flex justify-center items-center text-red-500">
          {error}
        </div>
      )}

      {!isLoading && !error && (
        <div className="space-y-6">
          {cases.length ? (
            cases.map((caseItem) => (
              <motion.div
                key={caseItem.caseId}
                className="bg-white rounded-lg shadow-md p-6 flex flex-col hover:shadow-xl transition-shadow duration-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="mb-4 text-gray-800">
                  <h2 className="text-lg font-semibold mb-2">Case Summary</h2>
                  {expandedCase === caseItem.caseId ? (
                    <>
                      <p className="text-sm whitespace-pre-line">{caseItem.symptomSummary}</p>
                      <button
                        className="text-purple-600 underline text-xs mt-2"
                        onClick={() => handleShowMoreClick(caseItem.caseId)}
                      >
                        Show Less
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-sm whitespace-pre-line">
                        {caseItem.symptomSummary.slice(0, 100)}
                        {caseItem.symptomSummary.length > 100 && "..."}
                      </p>
                      {caseItem.symptomSummary.length > 100 && (
                        <button
                          className="text-purple-600 underline text-xs mt-2"
                          onClick={() => handleShowMoreClick(caseItem.caseId)}
                        >
                          Show More
                        </button>
                      )}
                    </>
                  )}
                </div>

                <div className="text-xs text-gray-600 mb-4">
                  <span className="font-bold">{caseItem.patientEmail}</span> |
                  <span className="font-bold">{caseItem.patientNumber}</span> |
                  <span className="font-bold">{caseItem.patientAddress}</span>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">{caseItem.patientName}</h3>
                  <div className="flex items-center space-x-2">
                    <input
                      onChange={(e) => setReview(e.target.value)}
                      value={review}
                      type="text"
                      placeholder="Write your review"
                      className="flex-1 border rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      onClick={() => handleReviewSubmit(caseItem.caseId)}
                      className="bg-purple-600 text-white py-1 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Submit
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    onClick={() => handleViewReviews(caseItem.caseId)}
                    className="text-sm text-purple-600 underline"
                  >
                    {reviews&& reviews[caseItem.caseId] ? "Hide Reviews" : "View Reviews"}
                  </button>
                  {loadingReviews[caseItem.caseId] && (
                    <p className="text-gray-500 text-xs mt-2">Loading reviews...</p>
                  )}
                  {reviews&& reviews[caseItem.caseId] && (
                    <div className="mt-2 space-y-2">
                      {reviews[caseItem.caseId].map((review) => (
                        <Review
                          key={review.id}
                          reviewId={review.id}
                          doctorName={review.createdBy.name}
                          degree={review.createdBy.qualification}
                          specialization={review.createdBy.specialization}
                          content={review.content}
                          voteCount={review.voteCount}
                          doctorId={doctorId}
                          createdById={[{ createdById: review.reviewVote }]}
                          />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center text-gray-500">
              No cases available for this specialization.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
