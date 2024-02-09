import axios from "axios";
import { InputFile, InputText } from "elements/Form";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const MyModal = (props) => {
  const {
    showModal,
    closeModal,
    dataUserTable,
    onUserUpdate,
    inputFields,
    handleSaveChanges,
    setSelectedFile,
  } = props;
  const [editedUser, setEditedUser] = useState({ ...dataUserTable });
  // const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event);
    // setSelectedFile(event.target.files[0]);
  };
 
  const tokenNew = localStorage.getItem("token");
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    getValues,
  } = useForm({
    mode: "onChange",
  });

  const handleInputChange = (name,value) => {
    setEditedUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  return (
    <div
      className={`modal fade ${showModal ? "show" : ""}`}
      tabIndex="-1"
      role="dialog"
      style={{ display: "block" }}
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Users</h5>
            <button
              type="button"
              className="btn-close"
              onClick={closeModal}
            ></button>
          </div>
          <form onSubmit={handleSubmit(handleSaveChanges)}>
            <div className="modal-body">
              {inputFields.map((field, index) =>
                field.type === "file" ? (
                  <InputFile
                    key={index}
                    label={field.label}
                    name={field.name}
                    accept={field.accept}
                    isMultiple={field.isMultiple}
                    handleFileChange={handleFileChange}
                  />
                ) : (
                  <InputText
                    key={index}
                    label={field.label}
                    type={field.type}
                    register={register}
                    value={editedUser[field.name]}
                    onChange={handleInputChange}
                    name={field.name}
                    errors={errors}
                    validationOptions={field.validationOptions}
                    options={field.options}
                    control={control}
                    accept={field.accept}
                  />
                )
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeModal}
              >
                Close
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MyModal;
