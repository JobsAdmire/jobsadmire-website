import { useTranslation } from "next-i18next";
import React, { useState, useEffect, useRef } from "react";

const Step1 = ({ data, updateData, nextStep, currentSteps }) => {
  const { t } = useTranslation("resume-generator");
  const [formData, setFormData] = useState(
    data || {
      firstName: "",
      middleName: "",
      lastName: "",
      image: null,
      designation: "",
      address: "",
      email: "",
      phone: "",
      summary: "",
    }
  );

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  // Image cropping states
  const [showCropper, setShowCropper] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const cropperRef = useRef(null);
  const imageRef = useRef(null);
  const canvasRef = useRef(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("personal_information");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (formData.image && !parsedData.image) {
          parsedData.image = formData.image;
        }
        setFormData(parsedData);

        if (parsedData.imagePreview) {
          setImagePreview(parsedData.imagePreview);
        }
      } catch (error) {
        console.error("Error parsing saved data:", error);
      }
    }
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle file selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors({
        ...errors,
        image: t("step1.imageSizeError"),
      });
      return;
    }

    // Check file type
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setErrors({
        ...errors,
        image: t("step1.imageTypeError"),
      });
      return;
    }

    // Clear any previous errors
    const newErrors = { ...errors };
    delete newErrors.image;
    setErrors(newErrors);

    // Create file reader to convert to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target.result;
      setImageToCrop({
        file: file,
        url: imageUrl,
      });
      setShowCropper(true);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };
    reader.readAsDataURL(file);

    // Reset file input
    e.target.value = "";
  };

  // Mouse event handlers for dragging
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - crop.x,
      y: e.clientY - crop.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !cropperRef.current || !imageRef.current) return;

    e.preventDefault();
    const cropperRect = cropperRef.current.getBoundingClientRect();
    const imageRect = imageRef.current.getBoundingClientRect();

    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    // Calculate boundaries based on scaled image size
    const scaledWidth = imageRect.width;
    const scaledHeight = imageRect.height;
    const maxX = Math.min(0, cropperRect.width - scaledWidth);
    const maxY = Math.min(0, cropperRect.height - scaledHeight);

    setCrop({
      x: Math.max(maxX, Math.min(0, newX)),
      y: Math.max(maxY, Math.min(0, newY)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragStart, crop]);

  // Handle zoom change
  const handleZoomChange = (e) => {
    setZoom(parseFloat(e.target.value));
  };

  // Cancel cropping
  const handleCancelCrop = () => {
    setShowCropper(false);
    setImageToCrop(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setIsDragging(false);
  };

  // Apply crop
  const handleApplyCrop = () => {
    if (
      !imageToCrop ||
      !canvasRef.current ||
      !cropperRef.current ||
      !imageRef.current
    ) {
      console.error("Missing required elements for cropping");
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas size
    const outputSize = 200;
    canvas.width = outputSize;
    canvas.height = outputSize;

    // Create temporary image to get natural dimensions
    const tempImg = new Image();
    tempImg.onload = () => {
      // Get the current displayed image dimensions
      const imageElement = imageRef.current;
      const cropperElement = cropperRef.current;

      // Calculate the base size the image would be at zoom = 1
      const cropperWidth = 400;
      const cropperHeight = 320;
      const imageAspect = tempImg.naturalWidth / tempImg.naturalHeight;

      let baseWidth, baseHeight;
      if (imageAspect > cropperWidth / cropperHeight) {
        baseWidth = cropperWidth;
        baseHeight = cropperWidth / imageAspect;
      } else {
        baseHeight = cropperHeight;
        baseWidth = cropperHeight * imageAspect;
      }

      // Current displayed size with zoom
      const displayedWidth = baseWidth * zoom;
      const displayedHeight = baseHeight * zoom;

      // Calculate the crop circle center in the cropper
      const cropCenterX = cropperWidth / 2;
      const cropCenterY = cropperHeight / 2;
      const cropRadius = 100; // 200px diameter = 100px radius

      // Calculate where the crop center maps to on the displayed image
      const imageCropCenterX = cropCenterX - crop.x;
      const imageCropCenterY = cropCenterY - crop.y;

      // Convert to coordinates in the original image
      const scaleToOriginal = tempImg.naturalWidth / displayedWidth;
      const originalCropCenterX = imageCropCenterX * scaleToOriginal;
      const originalCropCenterY = imageCropCenterY * scaleToOriginal;
      const originalCropRadius = cropRadius * scaleToOriginal;

      // Calculate source rectangle for cropping
      const sourceX = Math.max(0, originalCropCenterX - originalCropRadius);
      const sourceY = Math.max(0, originalCropCenterY - originalCropRadius);
      const sourceWidth = Math.min(
        originalCropRadius * 2,
        tempImg.naturalWidth - sourceX
      );
      const sourceHeight = Math.min(
        originalCropRadius * 2,
        tempImg.naturalHeight - sourceY
      );

      // Clear canvas with white background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, outputSize, outputSize);

      // Draw cropped image
      ctx.drawImage(
        tempImg,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        outputSize,
        outputSize
      );

      // Convert to data URL
      const croppedImageUrl = canvas.toDataURL("image/jpeg", 0.9);

      // Update state
      setImagePreview(croppedImageUrl);
      setFormData((prev) => ({
        ...prev,
        image: imageToCrop.file,
        imagePreview: croppedImageUrl,
      }));

      // Close cropper
      handleCancelCrop();
    };

    tempImg.src = imageToCrop.url;
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName?.trim()) {
      newErrors.firstName = t("step1.firstNameRequired");
    }

    if (!formData.lastName?.trim()) {
      newErrors.lastName = t("step1.lastNameRequired");
    }

    if (!formData.email?.trim()) {
      newErrors.email = t("step1.emailRequired");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("step1.emailInvalid");
    }

    if (!formData.phone?.trim()) {
      newErrors.phone = t("step1.phoneRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      updateData(formData);

      try {
        const dataToSave = { ...formData };
        if (dataToSave.image instanceof File) {
          dataToSave.image = null;
        }
        localStorage.setItem(
          "personal_information",
          JSON.stringify(dataToSave)
        );
      } catch (error) {
        console.error("Error saving data to localStorage:", error);
      }

      nextStep();
    }
  };

  return (
    <div className="relative w-full">
      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Image Cropper Modal */}
      {showCropper && imageToCrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 max-w-2xl w-full mx-2 sm:mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="mb-3 sm:mb-4 text-base sm:text-lg md:text-xl font-semibold text-gray-800">
              {t("step1.cropperTitle")}
            </h3>

            {/* Cropper Container */}
            <div className="mb-3 sm:mb-4">
              <div
                ref={cropperRef}
                className="relative w-full mx-auto overflow-hidden bg-gray-100 border-2 border-gray-200 rounded-lg h-64 sm:h-80"
                style={{
                  cursor: isDragging ? "grabbing" : "grab",
                  width: "100%",
                  maxWidth: "400px",
                  height: window.innerWidth < 640 ? "256px" : "320px",
                }}
              >
                {/* Image */}
                <img
                  ref={imageRef}
                  src={imageToCrop.url}
                  alt={t("alts.cropPreviewAlt")}
                  className="absolute select-none"
                  style={{
                    left: `${crop.x}px`,
                    top: `${crop.y}px`,
                    transform: `scale(${zoom})`,
                    transformOrigin: "0 0",
                    width: "auto",
                    height: "auto",
                    maxWidth: "none",
                    maxHeight: "none",
                  }}
                  onMouseDown={handleMouseDown}
                  onLoad={(e) => {
                    // Set initial size and position when image loads
                    const img = e.target;
                    const cropperWidth = 400;
                    const cropperHeight = 320;
                    const aspectRatio = img.naturalWidth / img.naturalHeight;

                    let displayWidth, displayHeight;
                    if (aspectRatio > cropperWidth / cropperHeight) {
                      displayWidth = cropperWidth;
                      displayHeight = cropperWidth / aspectRatio;
                    } else {
                      displayHeight = cropperHeight;
                      displayWidth = cropperHeight * aspectRatio;
                    }

                    // Set CSS dimensions
                    img.style.width = `${displayWidth}px`;
                    img.style.height = `${displayHeight}px`;

                    // Center the image
                    setCrop({
                      x: (cropperWidth - displayWidth) / 2,
                      y: (cropperHeight - displayHeight) / 2,
                    });
                  }}
                  draggable={false}
                />

                {/* Crop Overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Dark overlay */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(circle 100px at center, transparent 100px, rgba(0,0,0,0.5) 100px)",
                    }}
                  />

                  {/* Crop circle border */}
                  <div
                    className="absolute border-4 border-white rounded-full"
                    style={{
                      width: "200px",
                      height: "200px",
                      left: "50%",
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Zoom Control */}
            <div className="mb-4 sm:mb-6">
              <label className="block mb-2 text-xs sm:text-sm font-medium text-gray-700">
                {t("step1.zoom", { zoom: zoom.toFixed(1) })}
              </label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={zoom}
                onChange={handleZoomChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((zoom - 0.5) / 2.5) * 100}%, #e5e7eb ${((zoom - 0.5) / 2.5) * 100}%, #e5e7eb 100%)`,
                }}
              />
            </div>

            {/* Preview */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
              <div>
                <p className="mb-2 text-xs sm:text-sm text-gray-600">
                  {t("step1.preview")}
                </p>
                <div className="w-16 h-16 overflow-hidden bg-gray-100 border-2 border-gray-300 rounded-full">
                  {imageToCrop && (
                    <canvas
                      width="64"
                      height="64"
                      ref={(previewCanvas) => {
                        if (previewCanvas && imageToCrop) {
                          const ctx = previewCanvas.getContext("2d");
                          const img = new Image();
                          img.onload = () => {
                            // Calculate the same crop area as the main cropper
                            const cropperWidth = 400;
                            const cropperHeight = 320;
                            const imageAspect =
                              img.naturalWidth / img.naturalHeight;

                            let baseWidth, baseHeight;
                            if (imageAspect > cropperWidth / cropperHeight) {
                              baseWidth = cropperWidth;
                              baseHeight = cropperWidth / imageAspect;
                            } else {
                              baseHeight = cropperHeight;
                              baseWidth = cropperHeight * imageAspect;
                            }

                            const displayedWidth = baseWidth * zoom;
                            const displayedHeight = baseHeight * zoom;

                            const cropCenterX = cropperWidth / 2;
                            const cropCenterY = cropperHeight / 2;
                            const cropRadius = 100;

                            const imageCropCenterX = cropCenterX - crop.x;
                            const imageCropCenterY = cropCenterY - crop.y;

                            const scaleToOriginal =
                              img.naturalWidth / displayedWidth;
                            const originalCropCenterX =
                              imageCropCenterX * scaleToOriginal;
                            const originalCropCenterY =
                              imageCropCenterY * scaleToOriginal;
                            const originalCropRadius =
                              cropRadius * scaleToOriginal;

                            const sourceX = Math.max(
                              0,
                              originalCropCenterX - originalCropRadius
                            );
                            const sourceY = Math.max(
                              0,
                              originalCropCenterY - originalCropRadius
                            );
                            const sourceWidth = Math.min(
                              originalCropRadius * 2,
                              img.naturalWidth - sourceX
                            );
                            const sourceHeight = Math.min(
                              originalCropRadius * 2,
                              img.naturalHeight - sourceY
                            );

                            ctx.clearRect(0, 0, 64, 64);
                            ctx.fillStyle = "#ffffff";
                            ctx.fillRect(0, 0, 64, 64);

                            ctx.drawImage(
                              img,
                              sourceX,
                              sourceY,
                              sourceWidth,
                              sourceHeight,
                              0,
                              0,
                              64,
                              64
                            );
                          };
                          img.src = imageToCrop.url;
                        }
                      }}
                      className="w-full h-full"
                    />
                  )}
                </div>
              </div>

              <div className="text-xs sm:text-sm text-left sm:text-right text-gray-600 space-y-1">
                <p>{t("step1.cropInstructions.drag")}</p>
                <p>{t("step1.cropInstructions.zoom")}</p>
                <p className="hidden sm:block">
                  {t("step1.cropInstructions.cropArea")}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-0 sm:space-x-3">
              <button
                onClick={handleCancelCrop}
                type="button"
                className="px-4 sm:px-6 py-2 text-sm sm:text-base text-gray-600 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200 w-full sm:w-auto"
              >
                {t("buttons.cancel")}
              </button>
              <button
                onClick={handleApplyCrop}
                type="button"
                className="px-4 sm:px-6 py-2 text-sm sm:text-base text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 w-full sm:w-auto"
              >
                {t("buttons.applyCrop")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animated background elements */}
      <div className="absolute w-40 h-40 rounded-full -top-10 -right-10 bg-sky-200 opacity-20 blur-3xl"></div>
      <div className="absolute w-40 h-40 bg-blue-200 rounded-full -bottom-10 -left-10 opacity-20 blur-3xl"></div>

      <div className="relative z-10">
        <div className="flex items-center pb-4 sm:pb-5 md:pb-6 mb-6 sm:mb-7 md:mb-8 border-b border-sky-100">
          <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 mr-3 sm:mr-4 text-white rounded-full shadow-md bg-gradient-to-r from-sky-400 to-blue-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 sm:w-5 sm:h-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-transparent bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text break-words">
            {t("step1.title")}
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 sm:space-y-7 md:space-y-8"
        >
          {/* Personal details section */}
          <div className="p-4 sm:p-5 md:p-6 border shadow-sm bg-gradient-to-br from-white to-sky-50 rounded-xl sm:rounded-2xl border-sky-100">
            <h3 className="mb-3 sm:mb-4 text-base sm:text-lg font-medium text-sky-700">
              {t("step1.basicDetails")}
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-sky-800"
                >
                  {t("step1.firstName")}
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName || ""}
                  onChange={handleChange}
                  placeholder={t("step1.firstNamePlaceholder")}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.firstName ? "border-red-500 bg-red-50" : "border-sky-200 focus:border-sky-400"} outline-none focus:ring-2 focus:ring-sky-200 transition-all duration-300`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs font-medium text-red-500">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="middleName"
                  className="block text-sm font-medium text-sky-800"
                >
                  {t("step1.middleName")}{" "}
                  <span className="text-sky-400">
                    {t("step1.middleNameOptional")}
                  </span>
                </label>
                <input
                  type="text"
                  id="middleName"
                  name="middleName"
                  value={formData.middleName || ""}
                  onChange={handleChange}
                  placeholder={t("step1.middleNamePlaceholder")}
                  className="w-full px-4 py-3 transition-all duration-300 border outline-none rounded-xl border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-sky-800"
                >
                  {t("step1.lastName")}
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName || ""}
                  onChange={handleChange}
                  placeholder={t("step1.lastNamePlaceholder")}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.lastName ? "border-red-500 bg-red-50" : "border-sky-200 focus:border-sky-400"} outline-none focus:ring-2 focus:ring-sky-200 transition-all duration-300`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs font-medium text-red-500">
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Profile section */}
          <div className="p-4 sm:p-5 md:p-6 border shadow-sm bg-gradient-to-br from-white to-sky-50 rounded-xl sm:rounded-2xl border-sky-100">
            <h3 className="mb-3 sm:mb-4 text-base sm:text-lg font-medium text-sky-700">
              {t("step1.professionalProfile")}
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-sky-800"
                >
                  {t("step1.profilePhoto")}
                </label>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-24 h-24 overflow-hidden border rounded-full bg-sky-100 border-sky-200">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt={t("alts.previewAlt")}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-12 h-12 text-sky-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <label
                      htmlFor="image"
                      className="inline-block px-4 py-2 transition-colors duration-300 bg-white border rounded-lg cursor-pointer border-sky-300 text-sky-600 hover:bg-sky-50"
                    >
                      {t("buttons.choosePhoto")}
                      <input
                        type="file"
                        id="image"
                        name="image"
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </label>
                    <p className="mt-2 text-xs text-sky-500">
                      {t("step1.uploadInstructions")}
                    </p>
                    {errors.image && (
                      <p className="mt-1 text-xs font-medium text-red-500">
                        {errors.image}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="designation"
                  className="block text-sm font-medium text-sky-800"
                >
                  {t("step1.designation")}
                </label>
                <input
                  type="text"
                  id="designation"
                  name="designation"
                  value={formData.designation || ""}
                  onChange={handleChange}
                  placeholder={t("step1.designationPlaceholder")}
                  className="w-full px-4 py-3 transition-all duration-300 border outline-none rounded-xl border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-sky-800"
                >
                  {t("step1.address")}
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                  placeholder={t("step1.addressPlaceholder")}
                  className="w-full px-4 py-3 transition-all duration-300 border outline-none rounded-xl border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
                />
              </div>
            </div>
          </div>

          {/* Contact section */}
          <div className="p-4 sm:p-5 md:p-6 border shadow-sm bg-gradient-to-br from-white to-sky-50 rounded-xl sm:rounded-2xl border-sky-100">
            <h3 className="mb-3 sm:mb-4 text-base sm:text-lg font-medium text-sky-700">
              {t("step1.contactInformation")}
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-sky-800"
                >
                  {t("step1.email")}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-sky-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    placeholder={t("step1.emailPlaceholder")}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.email ? "border-red-500 bg-red-50" : "border-sky-200 focus:border-sky-400"} outline-none focus:ring-2 focus:ring-sky-200 transition-all duration-300`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs font-medium text-red-500">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-sky-800"
                >
                  {t("step1.phone")}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-sky-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleChange}
                    placeholder={t("step1.phonePlaceholder")}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.phone ? "border-red-500 bg-red-50" : "border-sky-200 focus:border-sky-400"} outline-none focus:ring-2 focus:ring-sky-200 transition-all duration-300`}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-xs font-medium text-red-500">
                    {errors.phone}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-3">
                <label
                  htmlFor="summary"
                  className="block text-sm font-medium text-sky-800"
                >
                  {t("step1.summary")}
                </label>
                <textarea
                  id="summary"
                  name="summary"
                  value={formData.summary || ""}
                  onChange={handleChange}
                  rows="4"
                  placeholder={t("step1.summaryPlaceholder")}
                  className="w-full px-4 py-3 transition-all duration-300 border outline-none rounded-xl border-sky-200 focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
                ></textarea>
                <p className="text-xs text-sky-500">{t("step1.summaryTip")}</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Step1;
