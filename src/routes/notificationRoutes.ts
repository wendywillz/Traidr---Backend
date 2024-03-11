import express from 'express';
import { createNewNotification} from '../controller/notificationController';

const router = express.Router();

// Endpoint for creating notification
router.post('/create-notification', createNewNotification);



export default router;