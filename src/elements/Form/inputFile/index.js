import React, { useRef, useState } from "react";
import propTypes from "prop-types";
import { useDropzone } from "react-dropzone";

export default function File(props) {
  const {
    placeholder,
    name,
    accept,
    prepend,
    append,
    outerClassName,
    inputClassName,
    label,
    handleFileChange,
    isMultiple,
    maxFiles,
    maxSize,
  } = props;

  const refInputFile = useRef(null);
  const [files, setFiles] = useState([]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      accept: accept,
      onDrop: (acceptedFiles) => {
        setFiles(
          acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          )
        );

        handleFileChange(acceptedFiles);
      },
      maxFiles: maxFiles,
    });

  const fileRejectionItems = fileRejections.map(({ file, errors }) => {
    return (
      <li key={file.path}>
        {file.path} - {file.size} bytes
        <ul>
          {errors.map((e) => (
            <li key={e.code}>{e.message}</li>
          ))}
        </ul>
      </li>
    );
  });

  const thumbs = files.map((file) => (
    <div key={file.name} className="file-thumb">
      <div className="file-thumb-inner">
        <span>{file.name} - {file.size} bytes</span>
      </div>
    </div>
  ));

  return (
    <div>
      {prepend && (
        <div className="input-group-prepend bg-gray-900">
          <span className="input-group-text">{prepend}</span>
        </div>
      )}
      <label htmlFor={name} className="form-label">
        {label}
      </label>

      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} name={name} onChange={handleFileChange} />
        <div>
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag and drop some files here, or click to select files</p>
          )}
        </div>
      </div>
      {thumbs}
      <ul>{fileRejectionItems}</ul>
      {append && (
        <div className="input-group-append bg-gray-900">
          <span className="input-group-text">{append}</span>
        </div>
      )}
    </div>
  );
}

File.defaultProps = {
  placeholder: "Browse a file...",
  maxFiles: 1,
};

File.propTypes = {
  name: propTypes.string.isRequired,
  accept: propTypes.string.isRequired,
  value: propTypes.string.isRequired,
  onChange: propTypes.func.isRequired,
  prepend: propTypes.oneOfType([propTypes.number, propTypes.string]),
  append: propTypes.oneOfType([propTypes.number, propTypes.string]),
  placeholder: propTypes.string,
  outerClassName: propTypes.string,
  inputClassName: propTypes.string,
  maxFiles: propTypes.number,
};
