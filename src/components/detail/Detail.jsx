import React, { useEffect, useState } from "react";
import "./detail.css";
import { auth, db } from "../lib/firebase";
import { useUserStore } from "../lib/userStore";
import { useChatStore } from "../lib/chatStore";
import {
  arrayRemove,
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

const Detail = () => {
  const { chatId, user, changeBlock, isReceiverBlocked, isCurrentUserBlocked } =
    useChatStore();
  const { currentUser } = useUserStore();
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (!chatId) return;

    const chatRef = doc(db, "chats", chatId);
    const unsubscribe = onSnapshot(chatRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const imgs = data.messages
          .filter((msg) => msg.img)
          .map((msg) => ({ img: msg.img, name: msg.text || "Image" }));
        setImages(imgs);
      }
    });

    return () => unsubscribe();
  }, [chatId]);

  const handleBlock = async () => {
    if (!user) return;

    const userDocRef = doc(db, "users", currentUser.id);
    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="detail">
      <div className="user">
        <img src={user?.profilePic || "./avatar.png"} alt={user?.username} />
        <h2>{isCurrentUserBlocked ? "User" : user?.username}</h2>
        <p>Online</p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Shared Photos</span>
            {/* <img src="./arrowDown.png" alt="toggle" /> */}
          </div>
        </div>
        <div className="photos">
          {images.length > 0 ? (
            images.map((photo, index) => (
              <div className="photoItem" key={index}>
                <div className="photoDetail">
                  <img src={photo.img} alt={photo.name} />
                  <span>{photo.name}</span>
                </div>
                {/* <img src="./download.png" alt="Download" className="icon" /> */}
              </div>
            ))
          ) : (
            <span>Nothing to see here</span>
          )}
        </div>
        <button onClick={handleBlock}>
          {isReceiverBlocked ? "Unblock User" : "Block User"}
        </button>
      </div>
    </div>
  );
};

export default Detail;
