import axios from "axios";
import React, { createRef, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import NavbarTop from "components/NavbarTop";
import Sidebar from "components/Sidebar";
import Footer from "components/Footer";
import DataTable from "react-data-table-component";
import Loading from "components/Loading";
import Swal from "sweetalert2";
import { InputFile, InputText } from "elements/Form";

import { useForm } from "react-hook-form";

const UsersGalleryDetail = () => {
  const tokenNew = localStorage.getItem("token");
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [actived, setActived] = useState("users_gallery");
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [selectedFile, setSelectedFile] = useState([]);
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  const { id } = useParams();

  const [editedUser, setEditedUser] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    getValues,
  } = useForm({
    mode: "onChange",
  });

  const handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({ ...prevUser, [name]: value }));
  };
  const handleFileChange = (event) => {
    setSelectedFile(event);
    // setSelectedFile(event.target.files[0]);
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

  const getData = async () => {
    try {
      setLoading(true);
      await axios
        .post(
          `${process.env.REACT_APP_API_URL}get_user_gallery`,
          {
            user_id: id,
          },
          {
            headers: {
              authorization: `Bearer ${tokenNew}`,
            },
          }
        )
        .then((res) => {
          console.log(res);

          if (res.data.code == 401) {
            // navigate("/");
          } else {
            setEditedUser((prevUser) => ({
              ...prevUser,
              ["email"]: res.data[0]["user"]["email"],
            }));
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
                <div className="row">
                  <div className="col-12">
                    <div className="col-6">
                      <InputText
                        key="email"
                        label="Email"
                        type="text"
                        register={register}
                        value={editedUser["email"]}
                        onChange={handleInputChange}
                        name="email"
                        errors={errors}
                        validationOptions={{ require: "Name is required" }}
                        readOnly={true}
                      />
                    </div>
                    <div className="col-6">
                      <InputFile
                        key="image"
                        label="Image"
                        name="image"
                        accept="image/*"
                        isMultiple={true}
                        handleFileChange={handleFileChange}
                      />
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
};

export default UsersGalleryDetail;
