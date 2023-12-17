import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, User, Photo, Comment } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const photos = await prisma.photo.findMany({
      include: {
        user: true,
        comments: {
          include: {
            user: true
          }
        }
      }
    });

    res.status(200).json(photos);
  } catch (error) {
    console.error('Error fetching all photos:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
