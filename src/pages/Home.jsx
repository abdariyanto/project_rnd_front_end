import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarTop from "components/NavbarTop";
import Sidebar from "components/Sidebar";
import Footer from "components/Footer";
import { jwtDecode } from "jwt-decode";

export default function Home() {
  const tokenNew = localStorage.getItem("token");
  const refreshTokenNew = localStorage.getItem("refreshToken");
  const [expire, setExpire] = useState("");
  const [token, setToken] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [actived, setActived] = useState("dashboard");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const url = process.env.REACT_APP_API_URL;

  const getData = async () => {
    try {
      setLoading(true);
      await axios
        .get(`${process.env.REACT_APP_API_URL}users`, {
          headers: {
            authorization: `Bearer ${tokenNew}`,
          },
        })
        .then((res) => {
          if (res.data.code == 401) {
            navigate("/");
          } else {
            // setData(res.data);
            setLoading(false);
          }
        })
        .catch((error) => {
          setLoading(false);
          console.error(error);
        });
    } catch (error) {}
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  useEffect(() => {
    if (tokenNew == null) {
      navigate("/");
    }
    getData();
    // refreshToken();
  }, []);
  return (
    <div className="wrapper">
      <Sidebar isOpen={isSidebarOpen} actived={actived} />
      <div className="main">
        <NavbarTop toggleSidebar={toggleSidebar} />

        <main className="content px-3 py-2">
          <div className="container-fluid">
            <div className="row">
              <div className="mb-3">
                <h3 className="page-title">Dashboard</h3>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-3 col-xl-3 mb-2">
                <div className="card shadow">
                  <div className="card-body">
                    <h6>Active Users</h6>
                  </div>
                </div>
              </div>
              <div className="col-lg-9 col-xl-9 mb-2">
                <div className="card shadow">
                  <div className="card-body">
                    <h6>Chart Active Users</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer center={true} />
      </div>
    </div>
  );
}
