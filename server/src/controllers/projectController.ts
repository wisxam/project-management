import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
// import { isValid, parse } from "date-fns";

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

export const getProjects = async (
	req: Request, // Fetch information from request
	res: Response // Get the response
): Promise<void> => {
	try {
		const projects = await prisma.project.findMany(); // Go to prisma, go to prisma schema and then fetch the project schema from schema.prisma (doing npx prisma generate first, it creates all of these files and we're able to grab from prisma directory from the command, findMany() grabs the entire list of projects), this is an ORM.
		res.json(projects); // In response return the json list
	} catch (error: any) {
		res
			.status(500)
			.json({ message: `Error retrieving project: ${error.message}` });
	}
};

export const createProject = async (
	req: Request, // Fetch information from request
	res: Response // Get the response
): Promise<void> => {
	const { name, description, startDate, endDate } = req.body;
	try {
		const newProject = await prisma.project.create({
			data: {
				name,
				description,
				startDate,
				// parseDate(startDate).toISOString(),
				endDate,
				// parseDate(endDate).toISOString(),
			},
		});
		res.status(201).json(newProject); // Return successful code
	} catch (error: any) {
		res
			.status(500)
			.json({ message: `Error creating project: ${error.message}` });
	}
};

export const updateProject = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { projectId } = req.params;
	const { name, description, startDate, endDate } = req.body;

	try {
		const updateProject = await prisma.project.update({
			where: {
				id: Number(projectId),
			},
			data: {
				name,
				description,
				startDate,
				endDate,
			},
		});
		res.status(201).json(updateProject);
	} catch (error: any) {
		res
			.status(500)
			.json({ message: `Error updating project: ${error.message}` });
	}
};

export const deleteProject = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { projectId } = req.params;
	try {
		const deleteProject = await prisma.project.delete({
			where: {
				id: Number(projectId),
			},
		});
		res.status(201).json(deleteProject);
	} catch (error: any) {
		res
			.status(500)
			.json({ message: `Error deleting project: ${error.message}` });
	}
};
