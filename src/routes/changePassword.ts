import express from 'express'
import { changePassword} from '../controller/changePassword'
// import { verifyToken } from '../middleware/auth'



const router = express.Router()

router.post('/changePassword', changePassword)


export default router;