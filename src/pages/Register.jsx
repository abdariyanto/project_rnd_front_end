import React, { useState, useEffect } from "react";
import axios from "axios";
import { InputText } from "elements/Form";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
const Register = () => {
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
  } = useForm({
    mode: "onChange",
  });
  
  const onSubmit = async (data) => {
    try {
      await axios
        .post(`${process.env.REACT_APP_API_URL}register`, {
          name: data.name,
          email: data.email,
          password: data.password,
          confPassword: data.confPassword,
        })
        .then((res) => {
          if (res.data.code == 200) {
            Swal.fire({
              icon: "success",
              title: "Success Register!",
              text: res.data.msg,
            });

            navigate("/");
          } else {
            Swal.fire({
              icon: "error",
              title: "Failed Register!",
              text: res.data.msg,
            });
          }
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Failed Register!",
            text: `${error}`,
          });
        });
    } catch (error) {

      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  useEffect(() => {
  }, []);

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-lg-6 col-md-6 col-sm-6">
          <div className="card shadow">
            <div className="card-title text-center border-bottom">
              <h2 className="p-3">Register</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                 
                  <InputText
                    label="Name"
                    type="text"
                    register={register}
                    name="name"
                    errors={errors}
                    validationOptions={{
                      required: "Name is required",
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
                <div className="mb-4">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>

                  <input
                    className="form-control"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  <p className="redds">{errors.email?.message}</p>
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    className="form-control"
                    type="password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: 5,
                      maxLength: 20,
                    })}
                  />
                  <p className="redds">{errors.password?.message}</p>
                </div>
                <div className="mb-4">
                  <label htmlFor="confPassword" className="form-label">
                    Confirm Password
                  </label>
                  <input
                    className="form-control"
                    type="password"
                    {...register("confPassword", {
                      required: "Confirm Password is required",
                      minLength: {
                        value: 5,
                        message: "Name should be at least 5 characters",
                      },
                      maxLength: {
                        value: 20,
                        message: "Name should not exceed 20 characters",
                      },
                      validate: (value) =>
                        value === getValues("password") ||
                        "Passwords do not match",
                    })}
                  />
                  <p className="redds">{errors.confPassword?.message}</p>
                </div>
                <div className="d-grid">
                  <button className="btn btn-rounded btn-primary ">
                    Register
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
