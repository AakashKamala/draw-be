import { Router } from "express";

import { signup, signin, getUser } from "../controllers/user";
import { userAuth } from "../middlewares/userauth";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/user", userAuth, getUser);

export default router;