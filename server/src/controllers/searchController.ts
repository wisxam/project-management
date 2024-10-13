import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); // Use Prisma to fetch data from the database

export const search = async (
	req: Request, // Fetch information from request
	res: Response // Get the response
): Promise<void> => {
	const { query } = req.query;

	if (typeof query !== "string" || query.trim().length === 0) {
		res.status(400).json({ message: "Invalid search query" });
		return;
	}

	try {
		const tasks = await prisma.task.findMany({
			where: {
				OR: [
					{ title: { contains: query, mode: "insensitive" } },
					{ description: { contains: query, mode: "insensitive" } },
				],
			},
			// include: {
			// 	assignee: true,
			// 	author: true,
			// },
		});

		const projects = await prisma.project.findMany({
			where: {
				OR: [
					{ name: { contains: query, mode: "insensitive" } },
					{ description: { contains: query, mode: "insensitive" } },
				],
			},
		});

		const users = await prisma.user.findMany({
			where: {
				username: { contains: query, mode: "insensitive" },
			},
		});

		res.json({ tasks, projects, users });
	} catch (error: any) {
		console.error("Search error:", error);
		res
			.status(500)
			.json({ message: `Error performing search: ${error.message}`, query });
	}
};
