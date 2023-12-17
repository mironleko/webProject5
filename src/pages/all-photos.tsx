import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface Photo {
  id: string;
  imageData: string;
  title: string;
  user: { email: string };
}

const AllPhotosPage = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const router = useRouter(); 

  useEffect(() => {
    fetch('/api/all-photos')
      .then((response) => response.json())
      .then((data) => setPhotos(data))
      .catch((error) => console.error('Error fetching photos:', error));
  }, []);
  const navigateToMyPage = () => {
    router.push('/my-page');
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">All Photos</h1>
      <button
        onClick={navigateToMyPage}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg mb-4"
      >
        Back to My Page
      </button>
      <div className="grid grid-cols-3 gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="bg-white rounded-lg overflow-hidden shadow-md">
            <Link href={`/photo/${photo.id}`}>
              
                <img
                  src={`data:image/jpeg;base64,${photo.imageData}`}
                  alt={photo.title}
                  className="w-full h-auto"
                />
              
            </Link>
            <div className="p-4">
              <p>Published by: {photo.user.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllPhotosPage;
