import  express from "express";
import {verifyJWT} from "../middlewares/auth.js"
import {createNewAccount,loginAccount,logOutUser, refreshAccessToken} from "../controllers/user.js";
const router = express.Router();



router.post("/signup",createNewAccount);
router.post("/login",loginAccount);
router.post("/logout",verifyJWT,logOutUser)
router.post("/refreshtoken",refreshAccessToken);






export default router;