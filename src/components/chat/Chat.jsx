import React, { useEffect, useRef, useState } from "react";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "./../lib/firebase";
import { useChatStore } from "../lib/chatStore";
import { useUserStore } from "../lib/userStore";
import axios from "axios";

const Chat = () => {
  const [open, setOpen] = useState(false);
  const [chat, setChat] = useState();
  const [text, setText] = useState("");
  const [image, setImage] = useState(null); // file
  const [preview, setPreview] = useState(""); // preview URL

  const { currentUser } = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
    useChatStore();

  const endRef = useRef(null);

  if (!chatId || !user)
    return <div className="no-chat">Start a conversation</div>;

  // Scroll to bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // Listen for messages
  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });
    return () => unSub();
  }, [chatId]);

  // Handle image selection & preview
  const handleImage = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleSend = async () => {
    if (!text && !image) return;

    let imageUrl = null;

    if (image) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET_CHATS
      );
      formData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

      try {
        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
          }/image/upload`,
          formData
        );
        imageUrl = res.data.secure_url;
      } catch (err) {
        console.error("Image upload failed:", err);
        return;
      }
    }

    try {
      // Add message to chat
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          img: imageUrl || null,
          createdAt: new Date(),
        }),
      });

      // Update last message in userchats
      const userIDs = [currentUser.id, user.id];
      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);
        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();
          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );
          userChatsData.chats[chatIndex].lastMessage = text || "📷 Image";
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();
          await updateDoc(userChatsRef, { chats: userChatsData.chats });
        }
      });

      setText("");
      setImage(null);
      setPreview("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src={user?.profilePic || "./avatar.png"} alt={user?.username} />
          <div className="texts">
            <span>{isCurrentUserBlocked ? "User" : user?.username}</span>
            <p>Online</p>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />
        </div>
      </div>

      <div className="center">
        {isCurrentUserBlocked ? (
          <div className="blockmsg">You are Blocked</div>
        ) : (
          chat?.messages?.map((message) => (
            <div
              className={
                message.senderId === currentUser?.id ? "message own" : "message"
              }
              key={message?.createdAt}
            >
              <div className="texts">
                {message.img && (
                  <img
                    src={message.img}
                    alt="shared content"
                    className="chatImg"
                  />
                )}
                {message.text && <p>{message.text}</p>}
              </div>
            </div>
          ))
        )}
        <div ref={endRef}></div>
      </div>

      <div className="bottom">
        <div className="icons">
          <label htmlFor="imageUpload">
            <img src="./img.png" alt="" />
          </label>
          <input
            type="file"
            id="imageUpload"
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleImage}
          />

          <label htmlFor="cameraUpload">
            <img src="./camera.png" alt="Camera" />
          </label>
          <input
            type="file"
            id="cameraUpload"
            style={{ display: "none" }}
            accept="image/*"
            capture="environment"
            onChange={handleImage}
          />

          <img src="./mic.png" alt="" />
        </div>

        {/* Preview selected image */}
        {preview && (
          <div className="imagePreview">
            <img src={preview} alt="preview" className="chatImg" />
            <span
              onClick={() => {
                setImage(null);
                setPreview("");
              }}
            >
              ✖
            </span>
          </div>
        )}

        <input
          type="text"
          placeholder={
            isReceiverBlocked || isCurrentUserBlocked
              ? "You cannot text"
              : "Type a message..."
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isReceiverBlocked || isCurrentUserBlocked}
        />

        <div className="emoji">
          <img
            src="./emoji.png"
            alt=""
            onClick={() => setOpen((prev) => !prev)}
          />
          {open && (
            <div className="picker">
              <EmojiPicker onEmojiClick={handleEmoji} />
            </div>
          )}
        </div>

        <button
          className="sendButton"
          onClick={handleSend}
          disabled={isReceiverBlocked || isCurrentUserBlocked}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
