import React, { useState } from "react";
import "./userinfo.css";
import { useUserStore } from "../../lib/userStore";
import { auth } from "../../lib/firebase"; // Make sure auth is imported correctly

const Userinfo = () => {
  const { currentUser } = useUserStore();
  const [showLogout, setShowLogout] = useState(false); // State to toggle logout button

  const handleMoreClick = () => {
    setShowLogout((prev) => !prev); // Toggle logout button
  };

  return (
    <div className="userinfo">
      <div className="user">
        <img
          src={currentUser.profilePic || "./avatar.png"}
          alt={currentUser.username}
        />
        <h2>{currentUser?.username}</h2>
      </div>
      <div className="icons">
        <img src="./more.png" alt="more" onClick={handleMoreClick} />
        {showLogout && (
          <button className="logout" onClick={() => auth.signOut()}>
            Log Out
          </button>
        )}
      </div>
    </div>
  );
};

export default Userinfo;
