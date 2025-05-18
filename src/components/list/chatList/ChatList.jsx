import "./chatList.css";
import AddUser from "./addUser/AddUser";
import { useUserStore } from "../../lib/userStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useEffect, useState } from "react";
import { useChatStore } from "../../lib/chatStore";

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [addMode, setAddMode] = useState(false);

  const { currentUser } = useUserStore();
  const { chatId, changeChat } = useChatStore();

  useEffect(() => {
    if (!currentUser?.id) return;

    const unSub = onSnapshot(
      doc(db, "userchats", currentUser.id),
      async (res) => {
        const data = res.data();
        if (!data || !data.chats) {
          setChats([]);
          return;
        }

        const items = data.chats;
        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);

          const user = userDocSnap.data();

          return { ...item, user };
        });

        const chatData = await Promise.all(promises);
        // Sort by updatedAt descending
        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );

    return () => {
      unSub();
    };
  }, [currentUser?.id]);

  const handleSelect = async (chat) => {
    try {
      // Update local chats array: mark selected chat as seen
      const updatedChats = chats.map((item) =>
        item.chatId === chat.chatId ? { ...item, isSeen: true } : item
      );

      // Update Firestore with chats array excluding user details
      const userChatsRef = doc(db, "userchats", currentUser.id);
      await updateDoc(userChatsRef, {
        chats: updatedChats.map(({ user, ...rest }) => rest),
      });

      // Update local state so UI updates immediately
      setChats(updatedChats);

      // Change current chat context
      changeChat(chat.chatId, chat.user);
    } catch (err) {
      console.error("Error updating chat seen status:", err);
    }
  };

  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="search icon" />
          <input type="text" placeholder="Search" />
        </div>
        <img
          src={addMode ? "./minus.png" : "./plus.png"}
          alt={addMode ? "Close add user" : "Add user"}
          className="add"
          onClick={() => setAddMode((prev) => !prev)}
          style={{ cursor: "pointer" }}
        />
      </div>

      {chats.map((chat) => (
        <div
          className="item"
          key={chat.chatId}
          onClick={() => handleSelect(chat)}
          style={{
            backgroundColor: chat.isSeen ? "transparent" : "#5183fe",
            cursor: "pointer",
          }}
        >
          <img src="./avatar.png" alt="avatar" />
          <div className="texts">
            <span>{chat.user?.username}</span>
            <p>{chat.lastMessage || "No messages yet"}</p>
          </div>
        </div>
      ))}

      {addMode && <AddUser setAddMode={setAddMode} />}
    </div>
  );
};

export default ChatList;
