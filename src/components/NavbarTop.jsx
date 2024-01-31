import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LiaUserSolid } from "react-icons/lia";
import { IoIosLogOut  } from "react-icons/io";
import axios from "axios";

export default function NavbarTop({ toggleSidebar }) {
  const navigate = useNavigate();

  const Logout = async () => {
    try {
      await axios
        .post(`${process.env.REACT_APP_API_URL}logout`)
        .then((res) => {
          localStorage.clear()
          navigate("/");
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {}
  };
  return (
    <>
      <nav className="navbar navbar-expand px-3 border-bottom">
        <button className="btn border" type="button" onClick={toggleSidebar}>
          <span className="navbar-toggler-icon"></span>
        </button>
        <ul className="list-unstyled ms-auto">
          <li className="dropdown notification-list">
            <a
              className="nav-link dropdown-toggle nav-user arrow-none me-0"
              data-bs-toggle="dropdown"
              href="#"
              role="button"
              aria-haspopup="false"
              aria-expanded="false"
            >
              <span className="account-user-avatar">
                <LiaUserSolid style={{ fontSize: "1.5rem" }} />
              </span>
              {/* <span>
                <span className="account-user-name">{localStorage.getItem('name') ?? ''}</span>
              </span> */}
            </a>
            <div className="dropdown-menu dropdown-menu-end dropdown-menu-animated topbar-dropdown-menu profile-dropdown">
              <div className=" dropdown-header noti-title">
                <h6 className="text-overflow m-0">Welcome {localStorage.getItem('name') ?? ''}</h6>
              </div>

              <a href="#" onClick={Logout} className="dropdown-item notify-item">
                <IoIosLogOut  />
                <span>Logout</span>
              </a>
            </div>
          </li>
        </ul>
      </nav>
    </>
  );
}
