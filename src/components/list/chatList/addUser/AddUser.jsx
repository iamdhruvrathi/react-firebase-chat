import React, { useState } from "react";
import "./addUser.css";
import { db } from "./../../../lib/firebase";
import {
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  collection,
  where,
  arrayUnion,
} from "firebase/firestore";
import { useUserStore } from "./../../../lib/userStore";

const AddUser = ({ setAddMode }) => {
  const [user, setUser] = useState(null);
  const { currentUser } = useUserStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setUser(querySnapshot.docs[0].data());
      } else {
        console.log("User not found");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdd = async () => {
    try {
      // Create consistent chat ID for both users
      const chatId = [currentUser.id, user.id].sort().join("_");
      const chatRef = doc(db, "chats", chatId);

      const chatSnap = await getDoc(chatRef);

      // If chat doesn't exist, create it
      if (!chatSnap.exists()) {
        await setDoc(chatRef, {
          createdAt: serverTimestamp(),
          messages: [],
        });
      }

      const currentTime = Date.now();

      const currentUserChat = {
        chatId,
        lastMessage: "",
        receiverId: user.id,
        updatedAt: currentTime,
        isSeen: true,
      };

      const otherUserChat = {
        chatId,
        lastMessage: "",
        receiverId: currentUser.id,
        updatedAt: currentTime,
        isSeen: false,
      };

      // Add or update userchats for both users
      await setDoc(
        doc(db, "userchats", currentUser.id),
        {
          chats: arrayUnion(currentUserChat),
        },
        { merge: true }
      );

      await setDoc(
        doc(db, "userchats", user.id),
        {
          chats: arrayUnion(otherUserChat),
        },
        { merge: true }
      );

      setUser(null);
      setAddMode(false);
    } catch (err) {
      console.log("Error adding user chat:", err);
    }
  };

  return (
    <div className="addUser">
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="Username" name="username" />
        <button>Search</button>
      </form>
      {user && (
        <div className="user">
          <div className="detail">
            <img src="./avatar.png" alt="" />
            <span>{user.username}</span>
          </div>
          <button onClick={handleAdd}>Add User</button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
