import { Request, Response } from 'express';
import fs from 'fs-extra';
import prisma from '../db/prismaClient';
import {
  deleteAudioCloudinary,
  deleteImageCloudinary,
  uploadAudioCloudinary,
  uploadImageCloudinary,
} from '../utils/cloudinary';

export const getAllTracks = async (req: Request, res: Response) => {
  try {
    const allTracks = await prisma.track.findMany();
    res.status(201).send({ msg: 'Here are all your tracks', data: allTracks });
  } catch (error) {
    res.status(400).send({ msg: 'Error', error });
  }
};

export const createTrack = async (req: Request, res: Response) => {
  const { title, albumId, artistId } = req.body;
  const thumbnail = req.files?.thumbnail;
  const url = req.files?.url;
  const { userId } = req.params;

  if (!title || !thumbnail || !url) {
    return res
      .status(400)
      .send('The fields title, url, thumbnail are required');
  }
  try {
    
    if (Array.isArray(thumbnail) || Array.isArray(url)) {
      return res.status(400).json({
        msg: 'You can only upload one file per track.',
      });
    } else {
      const resultThumbnail = await uploadImageCloudinary(
        thumbnail.tempFilePath
      ); // Subir el archivo único
      const resultUrl = await uploadAudioCloudinary(url.tempFilePath); // Subir el archivo único
      const newTrack = await prisma.track.create({
        data: {
          title,
          url: resultUrl.secure_url,
          public_id_url: resultUrl.public_id,
          // albumId,
          artistId,
          userId,
          thumbnail: resultThumbnail.secure_url,
          public_id_thumbnail: resultThumbnail.public_id,
        },
      });
      await fs.unlink(thumbnail.tempFilePath);
      await fs.unlink(url.tempFilePath);
      return res.status(201).send({
        msg: 'New track has been created successfully',
        data: newTrack,
      });
    }
  } catch (error) {
    return res.status(400).send(error);
  }
};

export const updateTrack = async (req: Request, res: Response) => {
  const { title, albumId, artistId } = req.body;
  const thumbnail = req.files?.thumbnail;
  const { userId } = req.params;
  try {
    const updatedTrack = await prisma.track.update({
      where: { id: userId },
      data: {
        title,
        albumId,
        artistId,
        userId,
      },
    });
    if (req.files && thumbnail) {
      //Eliminar la imagen para volverla a subir
      //Elimina
      if (updatedTrack.public_id_thumbnail) {
        await deleteImageCloudinary(updatedTrack.public_id_thumbnail);
      }
      //Sube mismo método que el create
      if (Array.isArray(thumbnail)) {
        return res.status(400).json({
          msg: 'You can only upload one file per user.',
        });
      } else {
        const result = await uploadImageCloudinary(thumbnail.tempFilePath); // Subir el archivo único
        const newTrackThumbnail = await prisma.track.update({
          where: { id: userId },
          data: {
            thumbnail: result.secure_url,
            public_id_thumbnail: result.public_id,
          },
        });
        await fs.unlink(thumbnail.tempFilePath);
        return res
          .status(201)
          .send({ msg: 'The track has been updated', data: newTrackThumbnail });
      }
    }
    return res
      .status(201)
      .send({ msg: 'The track has been updated', data: updatedTrack });
  } catch (error) {
    res.status(400).send({ msg: 'ERROR' });
  }
};

export const deleteTrack = async (req: Request, res: Response) => {
  const { trackId } = req.params;

  try {
    const trackDeleted = await prisma.track.delete({ where: { id: trackId } });
    await deleteImageCloudinary(trackDeleted.public_id_thumbnail);
    await deleteAudioCloudinary(trackDeleted.public_id_url);
    res
      .status(201)
      .send({ msg: 'Track has been deleted successfully', data: trackDeleted });
  } catch (error) {
    res.status(400).send({ msg: 'ERROR' });
  }
};
