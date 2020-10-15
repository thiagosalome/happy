import { Request, Response, Express } from 'express';
import { getRepository } from 'typeorm';
import * as Yup from 'yup';
import Orphanage from '../models/Orphanage';
import OrphanageView from '../views/OrphanageView';

class OrphanagesController {
  async index(request: Request, response: Response) {
    // Pega a referência do orfanato no repositório
    const orphanagesRepository = getRepository(Orphanage);
    const orphanages = await orphanagesRepository.find({
      relations: ['images'],
    });

    return response.json(OrphanageView.renderMany(orphanages));
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;
    // Pega a referência do orfanato no repositório
    const orphanagesRepository = getRepository(Orphanage);
    const orphanage = await orphanagesRepository.findOneOrFail(id, {
      relations: ['images'],
    });

    return response.json(OrphanageView.render(orphanage));
  }

  async create(request: Request, response: Response) {
    const {
      name, latitude, longitude, about, instructions, opening_hours, open_on_weekends,
    } = request.body;
    const requestImages = request.files as Express.Multer.File[];
    const images = requestImages.map((image) => ({
      path: image.filename,
    }));

    const data = {
      name, latitude, longitude, about, instructions, opening_hours, open_on_weekends, images,
    };

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      latitude: Yup.number().required(),
      longitude: Yup.number().required(),
      about: Yup.string().required().max(300),
      instructions: Yup.string().required(),
      opening_hours: Yup.string().required(),
      open_on_weekends: Yup.string().required(),
      images: Yup.array(Yup.object().shape({
        path: Yup.string().required(),
      })),
    });

    await schema.validate(data, {
      abortEarly: false, // Ele retorna todos os erros ao mesmo tempo, e não um de cada vez
    });

    // Pega a referência do orfanato no repositório
    const orphanagesRepository = getRepository(Orphanage);
    const orphanage = orphanagesRepository.create(data); // Deixa o orfanato pré-criado

    await orphanagesRepository.save(orphanage); // Salva o orfanato

    return response.status(201).json(orphanage);
  }
}

export default new OrphanagesController();
