import axios from "axios";
import React, { createRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavbarTop from "components/NavbarTop";
import Sidebar from "components/Sidebar";
import Footer from "components/Footer";
import DataTable from "react-data-table-component";
import Loading from "components/Loading";
import Swal from "sweetalert2";

import { MdModeEditOutline, MdDeleteForever } from "react-icons/md";
import { HiUserAdd } from "react-icons/hi";

const UsersGallery = () => {
  const tokenNew = localStorage.getItem("token");
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [actived, setActived] = useState("users");
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [selectedFile, setSelectedFile] = useState([]);

  const [data, setData] = useState([]);
  const [dataUserTable, setDataUserTable] = useState([]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const getData = async () => {
    try {
      setLoading(true);
      await axios
        .get(`${process.env.REACT_APP_API_URL}users_gallery`, {
          headers: {
            authorization: `Bearer ${tokenNew}`,
          },
        })
        .then((res) => {
          if (res.data.code == 401) {
            navigate("/");
          } else {
            setData(res.data);
            setLoading(false);
          }
        })
        .catch((error) => {
          setLoading(false);
          console.error(error);
        });
    } catch (error) {}
  };

  const handleShow = (row) => {
    if (row) {
      setDataUserTable(row);
    }

    console.log(row);
    // setModalOpen(true);
  };
  const handleCloseModal = () => {
    setDataUserTable([]);
    setModalOpen(false);
  };

  const handleSaveChanges = async (data) => {
    try {
      const formData = new FormData();

      // Append other fields to the form data
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });
      selectedFile.forEach((key, index) => {
        formData.append(`image`, key);
      });
      // Lakukan permintaan Axios untuk menyimpan perubahan ke server
      await axios
        .post(
          `${process.env.REACT_APP_API_URL}${
            data.id ? "update_user_gallery" : "create_user_gallery"
          }`,
          formData,
          {
            headers: {
              authorization: `Bearer ${tokenNew}`,
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          if (res.data.code === 200) {
            getData();
            // Tampilkan SweetAlert untuk memberi tahu pengguna bahwa perubahan berhasil disimpan
            Swal.fire({
              icon: "success",
              title: "Changes Saved!",
              text: "User data has been updated successfully.",
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Error!",
              text: res.data.msg,
            });
          }
        });
      // // Tutup modal setelah menyimpan perubahan
      handleCloseModal();
    } catch (error) {
      // Tampilkan SweetAlert jika terjadi kesalahan saat menyimpan
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to save changes. Please try again.",
      });
      console.error("Error saving changes:", error);
    }
  };

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Image",
      selector: (row) =>
        row.image ? (
          <img
            src={`${process.env.REACT_APP_API_URL}public/${row.users_galleries[0].image_file}`}
            height="100px"
          />
        ) : (
          ""
        ),
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <Link
            className="btn btn-warning me-2"
            to={`/users_gallery_detail/${row.id}`}
          >
            <MdModeEditOutline />
          </Link>
          <button
            className="btn btn-danger"
            // onClick={() => handleDelete(row.id)}
          >
            <MdDeleteForever />
          </button>
        </>
      ),
      button: true,
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="wrapper">
      <Sidebar isOpen={isSidebarOpen} actived={actived} />
      <div className="main">
        <NavbarTop toggleSidebar={toggleSidebar} />

        <main className="content px-3 py-2">
          <div className="container-fluid">
            <div className="card">
              <div className="card-body">
                {loading ? (
                  <Loading />
                ) : (
                  <>
                    <div>
                      <Link
                        className="btn btn-warning me-2"
                        to={`/users_gallery_detail/0`}
                      >
                        <MdModeEditOutline />
                      </Link>
                    </div>
                    <DataTable
                      columns={columns}
                      data={data}
                      pagination
                      responsive
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
        <Footer center={true} />
      </div>
    </div>
  );
};

export default UsersGallery;
