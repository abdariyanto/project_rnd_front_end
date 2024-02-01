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
  const [data, setData] = useState([]);
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
      formData.append(`user_id`, editedUser["user_id"]);

      selectedFile.forEach((key, index) => {
        formData.append(`image`, key);
      });
      // Lakukan permintaan Axios untuk menyimpan perubahan ke server
      await axios
        .post(
          `${process.env.REACT_APP_API_URL}${"create_user_gallery"}`,
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
            // Tampilkan SweetAlert untuk memberi tahu pengguna bahwa perubahan berhasil disimpan
            Swal.fire({
              icon: "success",
              title: "Changes Saved!",
              text: "User Gallery data has been updated successfully.",
            }).then(() => {
              navigate("/users_gallery");
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Error!",
              text: res.data.msg,
            });
          }
        });
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
      if(id && id != ''){
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
            if (res.status === 200) {
              setEditedUser((prevUser) => ({
                ...prevUser,
                ["email"]: res.data[0]["user"]["email"],
                ["user_id"]: res.data[0]["user_id"],
              }));
              setData(res.data);
              setLoading(false);
            } else {
              setEditedUser((prevUser) => ({
                ...prevUser,
                ["email"]: '',
                ["user_id"]: 0,
              }));
            }
          })
          .catch((error) => {
            setLoading(false);
            console.error(error);
          });
      }
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
                  <form onSubmit={handleSubmit(handleSaveChanges)}>
                    <div className="col-12">
                      <div className="col-6">
                        <InputText
                          key="id"
                          type="hidden"
                          register={register}
                          value={editedUser["user_id"]}
                          name="id"
                          errors={errors}
                          validationOptions={{ require: "id" }}
                          readOnly={true}
                        />
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
                          validationOptions={{ require: "image" }}
                          maxFiles={2}
                        />
                      </div>
                      <div className="col-12 d-flex">
                        {data &&
                          data.map((field) => (
                            <div className="mx-4 mt-4 image-container">
                              <img
                                src={`${process.env.REACT_APP_API_URL}public/${field.image_file}`}
                              />
                            </div>
                          ))}
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary mx-2 my-2">
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        navigate("/users_gallery");
                      }}
                      className="btn btn-warning  my-2"
                    >
                      back
                    </button>
                  </form>
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
