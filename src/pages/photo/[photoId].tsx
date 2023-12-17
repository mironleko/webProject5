import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

interface Comment {
  id: string;
  content: string;
  user?: {
    email: string;
  };
}

interface Photo {
  id: string;
  imageData: string;
  title: string;
  comments: Comment[];
}

const PhotoDetailPage = () => {
  const router = useRouter();
  const { photoId } = router.query;
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (photoId) {
      fetch(`/api/photo/${photoId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => setPhoto(data))
        .catch((error) => console.error('Error fetching photo details:', error));
    }
  }, [photoId]);

  const handleBack = () => {
    router.push("/my-page");
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment || !photoId || isSubmitting) return;
  
    setIsSubmitting(true);
  
    try {
      const response = await fetch(`/api/photo/${photoId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            user: user,
            content: newComment 
          })
      });
      
      if (response.ok) {
        const addedComment = await response.json();
        if (photo) {
          setPhoto({
            ...photo,
            comments: [...photo.comments, addedComment]
          });
        }
        setNewComment('');
      } else {
        throw new Error('Failed to post comment');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  if (!photo) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white p-4 rounded-lg shadow-lg">
        <img
          src={`data:image/jpeg;base64,${photo.imageData}`}
          alt={photo.title}
          className="w-full rounded-lg"
        />
        <h2 className="text-2xl font-semibold mt-4">{photo.title}</h2>
        <div className="mt-4">
          <h3 className="text-xl font-semibold">Comments:</h3>
          <ul className="list-disc list-inside mt-2">
            {photo.comments.map((comment) => (
              <li key={comment.id} className="mb-2">
                {comment.content}
                {comment.user?.email && (
                  <span className="ml-2 text-gray-500">- {comment.user?.email}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
        <form onSubmit={handleCommentSubmit} className="mt-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full border-2 border-gray-300 p-2 rounded-lg"
            placeholder="Add a comment..."
            disabled={isSubmitting}
          />
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded-lg mt-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
        <button
          onClick={handleBack}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default PhotoDetailPage;
