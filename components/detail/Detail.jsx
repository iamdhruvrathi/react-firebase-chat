import React from "react";
import "./detail.css";

const Detail = () => {
  return (
    <div className="detail">
      <div className="user">
        <img src="./avatar.png" alt="" />
        <h2>Dhruv</h2>
        <p>Lorem ipsum dolor sit amet.</p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Privacy & Help</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Photos</span>
            <img src="./arrowDown.png" alt="" />
          </div>
        </div>
        <div className="photos">
          <div className="photoItem">
            <div className="photoDetail">
              <img
                src="https://cdn.prod.website-files.com/65de4c6f8dc17dc010f8ac55/67d3661a5901eb693e7456d5_66fc381ea437b00cbc162461_pexels-buro-millennial-636760-1438072.jpeg"
                alt=""
              />
              <span>photo_2024_2.png</span>
            </div>
            <img src="./download.png" alt="" className="icon" />
          </div>
          <div className="photoItem">
            <div className="photoDetail">
              <img
                src="https://cdn.prod.website-files.com/65de4c6f8dc17dc010f8ac55/67d3661a5901eb693e7456d5_66fc381ea437b00cbc162461_pexels-buro-millennial-636760-1438072.jpeg"
                alt=""
              />
              <span>photo_2024_2.png</span>
            </div>
            <img src="./download.png" alt="" className="icon" />
          </div>
          <div className="photoItem">
            <div className="photoDetail">
              <img
                src="https://cdn.prod.website-files.com/65de4c6f8dc17dc010f8ac55/67d3661a5901eb693e7456d5_66fc381ea437b00cbc162461_pexels-buro-millennial-636760-1438072.jpeg"
                alt=""
              />
              <span>photo_2024_2.png</span>
            </div>
            <img src="./download.png" alt="" className="icon" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <button>Block User</button>
        <button className="logout">Log Out</button>
      </div>
    </div>
  );
};

export default Detail;
