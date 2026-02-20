// src/utils/pdfGenerator.js
export const generatePDF = (cvContent, firstName, lastName) => {
  const printWindow = window.open('', '_blank');
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>CV - ${firstName} ${lastName}</title>
        <meta charset="utf-8">
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            line-height: 1.5;
            color: #374151;
            margin: 0;
            padding: 20px;
            background: white;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          .bg-white { background-color: white; }
          .p-8 { padding: 2rem; }
          .p-6 { padding: 1.5rem; }
          .shadow-lg { box-shadow: none; }
          .max-w-4xl { max-width: 56rem; }
          .mx-auto { margin-left: auto; margin-right: auto; }
          .border-b-2 { border-bottom-width: 2px; }
          .border-b { border-bottom-width: 1px; }
          .border-l-4 { border-left-width: 4px; }
          .border-gray-900 { border-color: #111827; }
          .border-gray-300 { border-color: #D1D5DB; }
          .border-blue-500 { border-color: #3B82F6; }
          .border-green-500 { border-color: #10B981; }
          .bg-gray-50 { background-color: #F9FAFB; }
          .bg-blue-50 { background-color: #EFF6FF; }
          .bg-gradient-to-r { background: linear-gradient(to right, #2563EB, #9333EA) !important; }
          .from-blue-600 { --tw-gradient-from: #2563EB; }
          .to-purple-600 { --tw-gradient-to: #9333EA; }
          .pb-4 { padding-bottom: 1rem; }
          .pb-1 { padding-bottom: 0.25rem; }
          .pl-4 { padding-left: 1rem; }
          .pr-4 { padding-right: 1rem; }
          .pt-2 { padding-top: 0.5rem; }
          .mb-6 { margin-bottom: 1.5rem; }
          .mb-2 { margin-bottom: 0.5rem; }
          .mb-3 { margin-bottom: 0.75rem; }
          .mb-4 { margin-bottom: 1rem; }
          .mt-2 { margin-top: 0.5rem; }
          .mt-1 { margin-top: 0.25rem; }
          .mr-1 { margin-right: 0.25rem; }
          .mr-2 { margin-right: 0.5rem; }
          .ml-1 { margin-right: 0.25rem; }
          .ml-2 { margin-left: 0.5rem; }
          .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
          .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
          .text-2xl { font-size: 1.5rem; line-height: 2rem; }
          .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
          .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
          .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
          .text-xs { font-size: 0.75rem; line-height: 1rem; }
          .font-bold { font-weight: 700; }
          .font-semibold { font-weight: 600; }
          .font-medium { font-weight: 500; }
          .text-gray-900 { color: #111827; }
          .text-gray-800 { color: #1F2937; }
          .text-gray-700 { color: #374151; }
          .text-gray-600 { color: #4B5563; }
          .text-gray-500 { color: #6B7280; }
          .text-blue-600 { color: #2563EB; }
          .text-blue-800 { color: #1E40AF; }
          .text-white { color: white; }
          .flex { display: flex; }
          .items-center { align-items: center; }
          .items-start { align-items: flex-start; }
          .justify-between { justify-content: space-between; }
          .justify-center { justify-content: center; }
          .flex-wrap { flex-wrap: wrap; }
          .gap-4 { gap: 1rem; }
          .gap-2 { gap: 0.5rem; }
          .space-y-4 > * + * { margin-top: 1rem; }
          .space-y-3 > * + * { margin-top: 0.75rem; }
          .space-y-2 > * + * { margin-top: 0.5rem; }
          .leading-relaxed { line-height: 1.625; }
          .whitespace-pre-line { white-space: pre-line; }
          .grid { display: grid; }
          .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          .rounded-lg { border-radius: 0.5rem; }
          .rounded { border-radius: 0.25rem; }
          .w-full { width: 100%; }
          .h-1 { height: 0.25rem; }
          .uppercase { text-transform: uppercase; }
          .tracking-wider { letter-spacing: 0.05em; }
          svg { display: inline-block; width: 14px; height: 14px; vertical-align: text-bottom; }
          @page {
            margin: 0.75in;
            size: A4;
          }
          @media print {
            body { 
              margin: 0; 
              padding: 0; 
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            .p-8 { padding: 1rem; }
            * {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
          }
        </style>
      </head>
      <body>
        ${cvContent}
      </body>
    </html>
  `);
  
  printWindow.document.close();
  printWindow.focus();
  
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
};