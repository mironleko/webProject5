import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function getUserPhotos(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req, res);
  if (!session || !session.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        auth0Id: session.user.sub,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const photos = await prisma.photo.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        imageData: true,
        title: true,
      },
    });

    res.status(200).json(photos);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
