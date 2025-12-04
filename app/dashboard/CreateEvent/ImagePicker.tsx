"use client"
import { useState } from "react";

interface ImagePickerProps {
  onImageSelect?: (file: File | null) => void;
}

const ImagePicker = ({ onImageSelect }: ImagePickerProps) => {
  const [fileError, setFileError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);

    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      onImageSelect?.(null);
      return;
    }

    // 2 MB in bytes
    const MAX_SIZE = 2 * 1024 * 1024;

    // Type check
    if (!file.type.startsWith("image/")) {
      setFileError("Please select an image file (jpg, jpeg, png).");
      e.target.value = "";
      setSelectedFile(null);
      onImageSelect?.(null);
      return;
    }

    // Size check
    if (file.size > MAX_SIZE) {
      setFileError("File must be 2 MB or smaller.");
      e.target.value = "";
      setSelectedFile(null);
      onImageSelect?.(null);
      return;
    }

    setSelectedFile(file);
    onImageSelect?.(file);
  };

  return (
    <div>
      <label className="label text-black font-bold mb-2">Select an Image</label>
      <input
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        className="file-input file-input-neutral bg-white"
        onChange={handleFileChange}
      />
      {selectedFile && (
        <p className="text-sm text-gray-600 mt-2">Selected: {selectedFile.name}</p>
      )}
      {!fileError && !selectedFile && (
        <label className="label text-xs text-gray-500">
          Max size 2MB
        </label>
      )}
      {fileError && (
        <p className="text-red-600 text-sm mt-1">{fileError}</p>
      )}
    </div>
  );
};

export default ImagePicker;