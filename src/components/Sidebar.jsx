import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome,FaUserFriends  } from "react-icons/fa";
export default function Sidebar(props) {
  const { isOpen, actived } = props;
  return (
    <aside id="sidebar" className={isOpen ? "collapsed" : " "}>
      <div className="h-100">
        <div className="sidebar-logo">
          <a href="#">Janisoft Technology</a>
        </div>
        <ul className="sidebar-nav">
          <li className="sidebar-header">
            Dashboard
          </li>
          <li className="sidebar-item">
            <Link to="/home" className={`sidebar-link ${
                    actived === "dashboard" ? "active" : ""
                  }`}>
              <FaHome className="me-1"/> Dashboard
            </Link>
          </li>
          <li className="sidebar-header">
            CRUD
          </li>
          <li className="sidebar-item">
            <a
              href="#"
              className="sidebar-link collapsed"
              data-bs-toggle="collapse"
              data-bs-target="#pages"
              aria-expanded="false"
              aria-controls="pages"
            >
              <FaUserFriends className="me-1"/>
              Master User
            </a>
            <ul
              id="pages"
              className="sidebar-dropdown collapse "
              data-bs-parent="#sidebar"
            >
              <li className={`sidebar-item `}>
                <Link
                  to="/users"
                  className={`sidebar-link ${
                    actived === "users" ? "active" : ""
                  }`}
                >
                  User
                </Link>
              </li>
              <li className="sidebar-item">
                <Link to="/users_gallery" className={`sidebar-link ${
                    actived === "users_gallery" ? "active" : ""
                  }`}>
                  User Gallery
                </Link>
              </li>
              <li className="sidebar-item">
                <Link to="/path" className="sidebar-link">
                  User Receiving
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </aside>
  );
}
