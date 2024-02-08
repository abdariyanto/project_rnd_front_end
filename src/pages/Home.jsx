import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarTop from "components/NavbarTop";
import Sidebar from "components/Sidebar";
import Footer from "components/Footer";
import { jwtDecode } from "jwt-decode";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
} from "recharts";
import Swal from "sweetalert2";

export default function Home() {
  const tokenNew = localStorage.getItem("token");
  const refreshTokenNew = localStorage.getItem("refreshToken");
  const [expire, setExpire] = useState("");
  const [token, setToken] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [actived, setActived] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [dataGender, setDataGender] = useState([]);
  const [dataActive, setDataActive] = useState([]);
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];
  const navigate = useNavigate();
  const url = process.env.REACT_APP_API_URL;

  const downloadExcel = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      setLoading(true);
      const formData = new FormData();

      const response = await axios
      .post(`${process.env.REACT_APP_API_URL}get_download`,formData, {
        headers: {
          authorization: `Bearer ${tokenNew}`,
        },
        responseType : "blob"
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Excel.xlsx"); // Replace with your desired file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const getData = async () => {
    try {
      setLoading(true);
      await axios
        .get(`${process.env.REACT_APP_API_URL}data_chart`, {
          headers: {
            authorization: `Bearer ${tokenNew}`,
          },
        })
        .then((res) => {
          if (res.data.code == 401) {
            navigate("/");
          } else {
            const newDataGender = res.data.genderCounts.map((item, index) => ({
              name: item.name,
              value: item.count,
              fill: COLORS[index],
            }));
            const newDataActive = res.data.userActiveCount.map(
              (item, index) => ({
                name: item.name,
                value: item.count,
                fill: COLORS[index],
              })
            );
            setDataGender(newDataGender);
            setDataActive(newDataActive);
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
              <div className="col-lg-6 col-xl-6 mb-2">
                <div className="card shadow">
                  <div className="card-body">
                    <h6>Active Users</h6>
                    <button
                      className="btn btn-primary my-2"
                      onClick={downloadExcel}
                    >
                      Download Excel
                    </button>
                    <div className="col-lg-12">
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dataActive}>
                          <CartesianGrid strokeDasharray="5 5" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-xl-6 mb-2">
                <div className="card shadow">
                  <div className="card-body">
                    <h6>Chart Gender Users</h6>
                    <div className="col-lg-12">
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={dataGender}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            // label
                          />
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
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
