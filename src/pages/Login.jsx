import React, { useEffect, useState } from "react";
import axios from "axios";
import { InputText } from "elements/Form";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import Footer from "components/Footer";
import Swal from "sweetalert2";

const Login = () => {
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}login`, {
        email: data.email,
        password: data.password,
      });


      if (res.data.code === 200) {
        localStorage.setItem("token", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        localStorage.setItem("name", res.data.name);
        reset();
        navigate("/home");
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed Register!",
          text: res.data.msg,
        });
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home");
    }
  }, []);
  return (
    <>
      <div className="container">
        <div className="row justify-content-center mt-5">
          <div className="col-lg-6 col-md-6 col-sm-6">
            <div className="card shadow">
              <div className="card-title text-center border-bottom">
                <h2 className="p-3">Login</h2>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-4">
                    <InputText
                      placeholder="Email"
                      label="Email"
                      type="email"
                      register={register}
                      name="email"
                      errors={errors}
                      validationOptions={{
                        required: "Email is required",
                      }}
                    />
                  </div>

                  <div className="mb-4">
                    <InputText
                      placeholder="Password"
                      label="Password"
                      type="password"
                      register={register}
                      name="password"
                      errors={errors}
                      validationOptions={{
                        required: "Password is required",
                        minLength: {
                          value: 5,
                          message: "Name should be at least 5 characters",
                        },
                        maxLength: {
                          value: 20,
                          message: "Name should not exceed 20 characters",
                        },
                      }}
                    />
                  </div>
                  <div className="d-grid">
                    <button
                      className="btn btn-rounded btn-primary"
                      type="submit"
                    >
                      Login
                    </button>
                    <Link to="/register" className="btn btn-light mt-2">
                      Register
                    </Link>
                  </div>
                  <div className="ms-1">{msg && <span>{msg}</span>}</div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
