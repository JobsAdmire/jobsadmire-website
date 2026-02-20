// components/InputField.js
import React from 'react';

const InputField = ({ label, id, type = 'text', value, onChange, placeholder, className = '', ...props }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-gray-700 text-sm font-medium mb-2">
      {label}
    </label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
      {...props}
    />
  </div>
);

export default InputField; // <--- IMPORTANT: Ensure this is 'export default'
