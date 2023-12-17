import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import { IncomingForm, Fields, Files } from 'formidable';

const prisma = new PrismaClient();

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function uploadPhoto(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const session = await getSession(req, res);
    if (!session || !session.user) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    const form = new IncomingForm();

    form.parse(req, async (err: Error | null, fields: Fields, files: Files) => {
        if (err) {
            console.error('Error processing file upload:', err);
            return res.status(500).json({ message: 'File upload error' });
        }

        // Extract the first file from the files object
        const fileArray = files.file;
        if (!fileArray || !Array.isArray(fileArray) || fileArray.length === 0) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const file = fileArray[0];
        const data = fs.readFileSync(file.filepath);
        const encodedImage = data.toString('base64');
        fs.unlinkSync(file.filepath); // Remove the temporary file

        try {
            const user = await prisma.user.findUnique({
                where: {
                    auth0Id: session.user.sub,
                },
            });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const photo = await prisma.photo.create({
                data: {
                    title: 'Uploaded Photo',
                    imageData: encodedImage,
                    userId: user.id,
                },
            });

            return res.status(200).json({ message: 'Photo uploaded successfully', photo });
        } catch (error) {
            console.error('Database error:', error);
            return res.status(500).json({ message: 'Database operation failed' });
        }
    });
}
