import  express from "express";
import {createNewAppointment} from "../controllers/appointment.js";
const router = express.Router();



router.post("/create",createNewAppointment);






export default router;