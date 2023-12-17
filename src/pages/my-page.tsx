import React, { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface Photo {
  id: string;
  imageData: string;
  title: string;
}

const MyPage = () => {
  const { user } = useUser();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch('/api/get-user-photos');
        if (!response.ok) {
          throw new Error('Failed to fetch photos');
        }
        const data = await response.json();
        setPhotos(data);
      } catch (error) {
        console.error('Error fetching photos:', error);
      }
    };

    if (user) {
      fetchPhotos();
    }
  }, [user]);

  const navigateToPhotoCapture = () => {
    router.push('/photo-capture');
  };
  const navigateToAllPhotos = () => {
    router.push('/all-photos')
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 bg-blue-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold">My Page</h1>
      <p className="mb-4">Welcome, {user.name}</p>

      <button
        onClick={navigateToPhotoCapture}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg mb-4"
      >
        Take a Photo
      </button>

      <button
        onClick={navigateToAllPhotos}
        className="bg-green-500 text-white py-2 px-4 rounded-lg mb-4"
      >
        View All Photos
      </button>

      <div className="grid grid-cols-3 gap-4">
        {photos.map((photo) => (
          <Link key={photo.id} href={`/photo/${photo.id}`}>
            
              <div className="bg-white rounded-lg overflow-hidden shadow-md">
                <img
                  src={`data:image/jpeg;base64,${photo.imageData}`}
                  alt={photo.title}
                  className="w-full h-auto"
                />
              </div>
            
          </Link>
        ))}
      </div>

      <div className="text-center mt-4">
        <Link href="/api/auth/logout" className="text-blue-500 hover:underline">
          Logout
        </Link>
      </div>
    </div>
  );
};

export default MyPage;
