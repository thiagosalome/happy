import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Orphanage from '../models/Orphanage';

class OrphanagesController {
  async index(request: Request, response: Response) {
    // Pega a referência do orfanato no repositório
    const orphanagesRepository = getRepository(Orphanage);
    const orphanages = await orphanagesRepository.find();

    return response.json(orphanages);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;
    // Pega a referência do orfanato no repositório
    const orphanagesRepository = getRepository(Orphanage);
    const orphanage = await orphanagesRepository.findOneOrFail(id);

    return response.json(orphanage);
  }

  async create(request: Request, response: Response) {
    const {
      name, latitude, longitude, about, instructions, opening_hours, open_on_weekends,
    } = request.body;

    // Pega a referência do orfanato no repositório
    const orphanagesRepository = getRepository(Orphanage);
    const orphanage = orphanagesRepository.create({
      name, latitude, longitude, about, instructions, opening_hours, open_on_weekends,
    }); // Deixa o orfanato pré-criado

    await orphanagesRepository.save(orphanage); // Salva o orfanato

    return response.status(201).json(orphanage);
  }
}

export default new OrphanagesController();
