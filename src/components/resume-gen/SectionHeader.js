// components/SectionHeader.js
import React from 'react';
import Button from './Button'; // Assuming Button is in the same components directory

const SectionHeader = ({ title, onAdd, onRemove, showAdd = true, showRemove = false }) => (
  <div className="flex justify-between items-center mb-4">
    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
    <div className="flex space-x-2">
      {showAdd && (
        <Button onClick={onAdd} variant="primary" className="text-sm py-1 px-3">
          Add
        </Button>
      )}
      {showRemove && (
        <Button onClick={onRemove} variant="danger" className="text-sm py-1 px-3">
          Remove Last
        </Button>
      )}
    </div>
  </div>
);

export default SectionHeader; // Ensure this is 'export default'