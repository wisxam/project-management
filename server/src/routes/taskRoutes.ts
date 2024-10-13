import { Router } from "express";
import {
	getTasks,
	createTask,
	updateTaskStatus,
	deleteTaskById,
	updateTaskById,
	getUserTasks,
} from "../controllers/taskController";

const router = Router();

router.get("/", getTasks);
router.post("/", createTask);
router.patch("/:taskId/status", updateTaskStatus); // patch is for updating (/:taskId because thats dynamic so the endpoint has to include the taskId that will be setting and also must set the status)
router.delete("/:taskId", deleteTaskById);
router.patch("/:taskId", updateTaskById);
router.get("/user/:userId", getUserTasks);

export default router;
