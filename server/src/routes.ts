import { Router } from 'express';
import multer from 'multer';
import uploadConfig from './config/upload';

// Controllers
import OrphanageController from './controllers/OrphanagesController';

const routes = Router();
const upload = multer(uploadConfig);

// Orphanages
routes.get('/orphanages', OrphanageController.index);
routes.get('/orphanages/:id', OrphanageController.show);
routes.post('/orphanages', upload.array('images'), OrphanageController.create);

export default routes;
