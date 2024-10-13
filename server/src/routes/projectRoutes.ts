import { Router } from "express";
import {
	getProjects,
	createProject,
	updateProject,
	deleteProject,
} from "../controllers/projectController";

const router = Router();

router.get("/", getProjects);
router.post("/", createProject);
router.patch("/:projectId", updateProject);
router.delete("/:projectId", deleteProject);

export default router;
