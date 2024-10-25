import { Router } from "express";
import {
	getProjects,
	createProject,
	updateProject,
	deleteProject,
} from "../controllers/projectController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.use(authenticateToken);
router.get("/", getProjects);
router.post("/", createProject);
router.patch("/:projectId", updateProject);
router.delete("/:projectId", deleteProject);

export default router;
