import React, { useState } from 'react';
import Camera from '../components/Camera';
import { useRouter } from 'next/router';

const PhotoCapturePage = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const router = useRouter();

  const handleCapture = (imageBlob: Blob) => {
    const imageUrl = URL.createObjectURL(imageBlob);
    setCapturedImage(imageUrl);
    setImageFile(new File([imageBlob], "photo.jpg", { type: "image/jpeg" }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];
    if (file) {
      setImageFile(file);
      setCapturedImage(URL.createObjectURL(file));
    }
  };

  const handlePostPhoto = async () => {
    if (imageFile) {
      const formData = new FormData();
      formData.append('file', imageFile);

      try {
        const response = await fetch('/api/upload-photo', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          router.push('/my-page');
        } else {
          const errorData = await response.json();
          console.error('Upload failed:', errorData.message);
        }
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
  };

  const navigateToMyPage = () => {
    router.push('/my-page');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Take or Upload a Photo</h1>
      <button
        onClick={navigateToMyPage}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg mb-4"
      >
        Back to My Page
      </button>

      {!capturedImage && (
        <div>
          <div className="flex flex-col items-center">
            <Camera onCapture={handleCapture} onCameraError={() => {}} />
            <div className="mt-4">
              <label htmlFor="file-input" className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-lg">
                Choose File
              </label>
              <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>
      )}

      {capturedImage && (
        <div className="flex flex-col items-center">
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full max-w-xs h-auto mb-4"
          />
          <button
            onClick={() => setCapturedImage(null)}
            className="bg-red-500 text-white py-2 px-4 rounded-lg mb-2"
          >
            Retake Photo or upload another file
          </button>
          <button
            onClick={handlePostPhoto}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg"
          >
            Post Photo
          </button>
        </div>
      )}
    </div>
  );
};

export default PhotoCapturePage;
