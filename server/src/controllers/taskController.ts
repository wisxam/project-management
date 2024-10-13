import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
// import { parse, isValid } from "date-fns";

const prisma = new PrismaClient(); // Use prisma and fetch data from database

// function parseDate(dateString: string): Date {
// 	const formats = ["MM-dd-yyyy", "yyyy-MM-dd"];
// 	for (const format of formats) {
// 		const parsedDate = parse(dateString, format, new Date());
// 		if (isValid(parsedDate)) {
// 			return parsedDate;
// 		}
// 	}
// 	throw new Error("Invalid date format");
// }

export const getTasks = async (
	req: Request, // Fetch information from request
	res: Response // Get the response
): Promise<void> => {
	const { projectId } = req.query; // get from query not body because this is a get request (used upon using post while needing extra info in parameters)
	try {
		const tasks = await prisma.task.findMany({
			where: {
				projectId: Number(projectId),
			},
			include: {
				author: true,
				assignee: true,
				comments: {
					include: {
						user: true,
					},
				},
				attachments: true,
				// project: true,
			},
		}); // It will have several conditions, a task wont be available until the previous task is finished
		res.json(tasks); // In response return the json list
	} catch (error: any) {
		res
			.status(500)
			.json({ message: `Error retrieving tasks: ${error.message}` });
	}
};

export const createTask = async (
	req: Request,
	res: Response
): Promise<void> => {
	const {
		title,
		description,
		status,
		priority,
		tags,
		startDate,
		dueDate,
		points,
		projectId,
		authorUserId,
		assignedUserId,
	} = req.body;
	try {
		const newTask = await prisma.task.create({
			data: {
				title,
				description,
				status,
				priority,
				tags,
				startDate,
				dueDate,
				points,
				projectId,
				authorUserId,
				assignedUserId,
			},
		});
		res.status(201).json(newTask);
	} catch (error: any) {
		res
			.status(500)
			.json({ message: `Error creating a task: ${error.message}` });
	}
};

export const updateTaskStatus = async (
	req: Request, // Fetch information from request
	res: Response // Get the response
): Promise<void> => {
	const { taskId } = req.params;
	const { status } = req.body; // get from query not body because this is a get request (used upon using post while needing extra info in parameters)

	try {
		const updatedTask = await prisma.task.update({
			where: {
				id: Number(taskId),
			},
			data: {
				status: status,
			},
		});
		res.json(updatedTask); // It will have several conditions, a task wont be available until the previous task is finished
		// In response return the json list
	} catch (error: any) {
		res.status(500).json({ message: `Error updating task: ${error.message}` });
	}
};

export const deleteTaskById = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { taskId } = req.params; // Can be a single id or array of ids
	const taskIds = Array.isArray(req.body.taskIds) ? req.body.taskIds : [taskId];

	try {
		// Check if we're deleting multiple tasks or a single task
		if (taskIds.length === 1) {
			const deleteTask = await prisma.task.delete({
				where: {
					id: Number(taskIds[0]),
				},
			});
			res.json(deleteTask);
		} else {
			// Delete multiple tasks
			const deleteTasks = await prisma.task.deleteMany({
				where: {
					id: {
						in: taskIds.map((id: string) => Number(id)),
					},
				},
			});
			res.json(deleteTasks);
		}
	} catch (error: any) {
		res
			.status(500)
			.json({ message: `Error deleting task(s): ${error.message}` });
	}
};

export const updateTaskById = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { taskId } = req.params;
	const {
		title,
		description,
		status,
		priority,
		tags,
		startDate,
		dueDate,
		points,
		projectId,
		authorUserId,
		assignedUserId,
	} = req.body;

	try {
		const updatedTask = await prisma.task.update({
			where: {
				id: Number(taskId),
			},
			data: {
				title,
				description,
				status,
				priority,
				tags,
				startDate,
				dueDate,
				points,
				projectId,
				authorUserId,
				assignedUserId,
			},
		});
		res.status(201).json(updatedTask);
	} catch (error: any) {
		res.status(500).json({ message: `Error updating task: ${error.message}` });
	}
};

export const getUserTasks = async (
	req: Request, // Fetch information from request
	res: Response // Get the response
): Promise<void> => {
	const { userId } = req.params; // get from query not body because this is a get request (used upon using post while needing extra info in parameters)
	try {
		const tasks = await prisma.task.findMany({
			where: {
				OR: [
					{
						authorUserId: Number(userId),
					},
					{
						assignedUserId: Number(userId),
					},
				],
			},
			include: {
				author: true,
				assignee: true,
			},
		}); // It will have several conditions, a task wont be available until the previous task is finished
		res.json(tasks); // In response return the json list
	} catch (error: any) {
		res
			.status(500)
			.json({ message: `Error retrieving users tasks: ${error.message}` });
	}
};
