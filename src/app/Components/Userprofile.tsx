"use client";

import React from "react";



interface UserProfileProps {
  name: string;
  email: string;
  phoneNumber?: string;
  Address?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({
  name,
  email,
  phoneNumber,
  Address,
}) => {
  return (
    <div className="flex items-center space-x-6">
      <div className="flex-shrink-0">
        <img
          src="/default-avatar.png"
          alt={name}
          className="w-24 h-24 rounded-full"
        />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
        <p className="text-gray-600">Email: {email}</p>
        <p className="text-gray-600">Phone: {phoneNumber}</p>
        <p className="text-gray-600">Address: {Address}</p>
      </div>

    
    </div>
  );
};

export default UserProfile;
