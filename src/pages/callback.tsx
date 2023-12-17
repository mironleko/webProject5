import React, { useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router';

const CallbackPage = () => {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    const addUserIfNeeded = async () => {
      if (user) {
        try {
          const response = await fetch('/api/addUser', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user }),
          });

          if (!response.ok) {
            throw new Error('Failed to call addUser API');
          }

          router.push('/my-page');
        } catch (error) {
          console.error('Error calling addUser API:', error);
          // Handle errors here
        }
      }
    };

    if (!isLoading) {
      addUserIfNeeded();
    }
  }, [user, isLoading, router]);

  if (isLoading) return <p>Loading...</p>;

  return <p>Redirecting...</p>;
};

export default CallbackPage;
