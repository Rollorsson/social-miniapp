"use client";

import { UserProfile } from "~~/components/bubble/UserProfile";

const ProfilePage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">User Profile</h1>
      <UserProfile />
    </div>
  );
};

export default ProfilePage;
