import React, { useRef, useState, useEffect } from 'react';

interface CameraProps {
  onCapture: (imageBlob: Blob) => void;
  onCameraError: (error: boolean) => void;
}

const Camera: React.FC<CameraProps> = ({ onCapture, onCameraError }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraAccessible, setCameraAccessible] = useState(true);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const enableStream = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraAccessible(true);
        }
      } catch (err) {
        setCameraAccessible(false);
        onCameraError(true);
      }
    };

    enableStream();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [onCameraError]);

  const takePhoto = () => {
    if (videoRef.current) {
      const width = videoRef.current.videoWidth;
      const height = videoRef.current.videoHeight;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d');
      if (context && videoRef.current) {
        context.drawImage(videoRef.current, 0, 0, width, height);
        canvas.toBlob(blob => {
          if (blob) {
            onCapture(blob);
          }
        }, 'image/jpeg');
      }
    }
  };

  if (!cameraAccessible) {
    return null;
  }

  return (
    <div className="relative">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full rounded-lg shadow-md mb-4"
      ></video>
      <div className="text-center">
        <button
          onClick={takePhoto}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg"
        >
          Take Photo
        </button>
      </div>
    </div>
  );
};

export default Camera;
