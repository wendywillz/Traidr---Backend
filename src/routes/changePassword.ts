import express from 'express'
import { changePassword} from '../controller/changePassword'

const router = express.Router()

router.post('/changePassword', changePassword)


export default router;