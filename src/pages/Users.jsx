import axios from "axios";
import React, { createRef, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarTop from "components/NavbarTop";
import Sidebar from "components/Sidebar";
import Footer from "components/Footer";
import DataTable from "react-data-table-component";
import Loading from "components/Loading";
import MyModal from "components/MyModal";
import { MdModeEditOutline, MdDeleteForever } from "react-icons/md";
import { HiUserAdd } from "react-icons/hi";
import Swal from "sweetalert2";

const Users = () => {
  const tokenNew = localStorage.getItem("token");
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [actived, setActived] = useState("users");
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);

  const [data, setData] = useState([]);
  const [dataUserTable, setDataUserTable] = useState([]);

  const handleShow = (row) => {
    if (row) {
      setDataUserTable(row);
    }
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios
        .post(
          `${process.env.REACT_APP_API_URL}delete_user`,
          {
            id: id,
          },
          {
            headers: { authorization: `Bearer ${tokenNew}` },
          }
        )
        .then((res) => {
          if (res.data.code === 200) {
            Swal.fire({
              icon: "success",
              title: "Success Delete User!",
              text: res.data.msg,
            });
            getData();
          } else {
            Swal.fire({
              icon: "error",
              title: "Failed Delete User!",
              text: res.data.msg,
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.log({ error });
    }
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
            data.id ? "update_user" : "create_user"
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
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
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
  // header table
  const columns = useMemo(
    () => [
      {
        name: "Name",
        selector: (row) => row.name,
        sortable: true,
      },
      {
        name: "Email",
        selector: (row) => row.email,
        sortable: true,
      },
      {
        name: "Gender",
        selector: (row) => (row.gender === "1" ? "Laki-Laki" : "Perempuan"),
        sortable: true,
      },
      {
        name: "Image",
        selector: (row) =>
          row.image ? (
            <img
              src={`${process.env.REACT_APP_API_URL}public/${row.image}`}
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
            <button
              className="btn btn-warning me-2"
              onClick={() => handleShow(row)}
            >
              <MdModeEditOutline />
            </button>
            <button
              className="btn btn-danger"
              onClick={() => handleDelete(row.id)}
            >
              <MdDeleteForever />
            </button>
          </>
        ),
        button: true,
      },
    ],
    [handleDelete]
  );

  const modalFields = [
    { name: "id", type: "hidden", label: false, validationOptions: {} },
    {
      name: "name",
      label: "Name",
      type: "text",
      validationOptions: { require: "Name is required" },
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      validationOptions: { required: "Email is required" },
    },
    {
      name: "gender",
      label: "Gender",
      type: "select",
      validationOptions: { required: "Gender is required" },
      options: [
        { value: "1", label: "Laki-Laki" },
        { value: "2", label: "Perempuan" },
      ],
      isMultiple: false,
    },
    {
      name: "image",
      label: "Image",
      type: "file",
      accept: "image/*",
      validationOptions: { required: "Image is required" },
      isMultiple: true,
    },
  ];

  const paginationComponentOptions = {
    rowsPerPageText: "Rows Per Page",
    rangeSeparatorText: "to",
    selectAllRowsItem: true,
    selectAllRowsItemText: "All",
  };

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
                    <button
                      className="btn btn-warning me-2 mb-2"
                      onClick={() => handleShow()}
                    >
                      <HiUserAdd />
                    </button>
                    <DataTable
                      columns={columns}
                      data={data}
                      pagination
                      paginationComponentOptions={paginationComponentOptions}
                      responsive
                    />
                  </>
                )}
                {isModalOpen && (
                  <MyModal
                    showModal={isModalOpen}
                    closeModal={handleCloseModal}
                    dataUserTable={dataUserTable}
                    onUserUpdate={getData}
                    inputFields={modalFields}
                    handleSaveChanges={handleSaveChanges}
                    // onChange={handleFileChange}
                    setSelectedFile={setSelectedFile}
                  />
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

export default Users;
