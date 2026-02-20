// components/TextAreaField.js
import React from 'react';

const TextAreaField = ({ label, id, value, onChange, placeholder, className = '', rows = 4, ...props }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-gray-700 text-sm font-medium mb-2">
      {label}
    </label>
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
      {...props}
    ></textarea>
  </div>
);

export default TextAreaField;