// components/TemplateCard.js
import React from 'react';

const TemplateCard = ({ template, isSelected, onSelect }) => (
  <div
    className={`border rounded-lg p-6 cursor-pointer transition-all duration-300 ease-in-out ${
      isSelected ? 'border-blue-600 ring-2 ring-blue-500 shadow-lg' : 'border-gray-300 hover:shadow-md'
    }`}
    onClick={() => onSelect(template.id)}
  >
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{template.name}</h3>
    <p className="text-gray-600 text-sm">{template.description}</p>
    {/* Placeholder for template image/preview */}
    <div className="mt-4 bg-gray-100 h-32 flex items-center justify-center rounded-md text-gray-400 text-sm">
      Template Preview
    </div>
  </div>
);

export default TemplateCard;
