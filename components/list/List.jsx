import React from "react";
import "./list.css";
import Userinfo from "./userinfo/USerinfo";
import ChatList from "./chatList/Chatlist";

const List = () => {
  return (
    <div className="list">
      <Userinfo />
      <ChatList />
    </div>
  );
};

export default List;
