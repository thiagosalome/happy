import { Router } from 'express';

// Controllers
import OrphanageController from './controllers/OrphanagesController';

const routes = Router();

// Orphanages
routes.get('/orphanages', OrphanageController.index);
routes.get('/orphanages/:id', OrphanageController.show);
routes.post('/orphanages', OrphanageController.create);

export default routes;
