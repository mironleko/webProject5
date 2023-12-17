import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { photoId } = req.query;
  const photoIdInt = parseInt(photoId as string, 10);

  if (req.method === 'GET') {
    try {
      const photo = await prisma.photo.findUnique({
        where: { id: photoIdInt },
        include: {
          comments: {
            include: { user: true },
          },
        },
      });

      if (!photo) {
        return res.status(404).json({ error: 'Photo not found' });
      }

      return res.status(200).json(photo);
    } catch (error) {
      console.error('Error fetching photo details:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    const { user, content } = req.body;

    if (!user || !user.sub) {
      return res.status(400).json({ error: 'User identification is required' });
    }

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    try {
      // Find the user ID based on the auth0Id
      const existingUser = await prisma.user.findUnique({
        where: { auth0Id: user.sub },
      });

      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      const newComment = await prisma.comment.create({
        data: {
          content: content,
          photoId: photoIdInt,
          userId: existingUser.id,
        },
        include: {
          user: true,
        },
      });

      return res.status(200).json(newComment);
    } catch (error) {
      console.error('Error creating comment:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
