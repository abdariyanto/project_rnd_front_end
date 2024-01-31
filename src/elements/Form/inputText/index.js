import React, { useState } from "react";
import propTypes from "prop-types";
import Select from "react-select";
import { Controller } from "react-hook-form";
import { InputFile } from "../index";
export default function Text(props) {
  const {
    label,
    type,
    register,
    name,
    errors,
    validationOptions = {},
    value,
    prepend,
    append,
    outerClassName,
    inputClassName,
    onChange,
    onChangeFile,
    options,
    isMulti,
    control,
    accept,
    readOnly
  } = props;

  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);

  const { required, minLength, maxLength, pattern, validate } =
    validationOptions;

  if (type === "select") {
    return (
      <div>
        {prepend && (
          <div className="input-group-prepend bg-gray-900">
            <span className="input-group-text">{prepend}</span>
          </div>
        )}
        {label && (
          <label htmlFor={name} className="form-label">
            {label.toUpperCase()}
          </label>
        )}
        <Controller
          name="gender"
          control={control}
          defaultValue={value}
          render={({ field }) => (
            <Select
              {...register(name, validationOptions)}
              name={name}
              value={options.find((option) => option.value === field.value)}
              onChange={(selectedOption) =>
                field.onChange(selectedOption.value)
              }
              options={options}
              isMulti={isMulti}
            />
          )}
        />
        {append && (
          <div className="input-group-append bg-gray-900">
            <span className="input-group-text">{append}</span>
          </div>
        )}
        {errors[name] && <span className="redds">{errors[name]?.message}</span>}
      </div>
    );
  }

  return (
    <div>
      {prepend && (
        <div className="input-group-prepend bg-gray-900">
          <span className="input-group-text">{prepend}</span>
        </div>
      )}
      {label && (
        <label htmlFor={name} className="form-label">
          {label.toUpperCase()}
        </label>
      )}

      <input
        name={name}
        type={type}
        className={["form-control", inputClassName].join(" ")}
        value={value}
        {...register(name, validationOptions)}
        onChange={onChange}
        readOnly={readOnly}
      />
      {append && (
        <div className="input-group-append bg-gray-900">
          <span className="input-group-text">{append}</span>
        </div>
      )}
      {errors[name] && <span className="redds">{errors[name]?.message}</span>}
    </div>
    // <div className={["input-text mb-3", outerClassName].join(" ")}>

    // </div>
  );
}

Text.defaultProps = {
  type: "text",
  pattern: "",
  placeholder: "Please type here...",
  errorResponse: "Please match the requested format 1.",
  validationOptions: {},
  options: [],
  readOnly : false
};

Text.propTypes = {
  name: propTypes.string.isRequired,
  value: propTypes.oneOfType([propTypes.number, propTypes.string]),
  onChange: propTypes.func,
  prepend: propTypes.oneOfType([propTypes.number, propTypes.string]),
  append: propTypes.oneOfType([propTypes.number, propTypes.string]),
  type: propTypes.string,
  placeholder: propTypes.string,
  outerClassName: propTypes.string,
  inputClassName: propTypes.string,
  validationOptions: propTypes.object,
  options: propTypes.arrayOf(
    propTypes.shape({
      value: propTypes.oneOfType([propTypes.number, propTypes.string]),
      name: propTypes.string,
    })
  ),
  readOnly : propTypes.bool
};
