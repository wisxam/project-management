import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTeams = async (
	req: Request, // Fetch information from request
	res: Response // Get the response
): Promise<void> => {
	try {
		const teams = await prisma.team.findMany(); // Use prisma and fetch data from database

		const teamsWithUsernames = await Promise.all(
			teams.map(async (team: any) => {
				const productOwnerId = await prisma.user.findUnique({
					select: { username: true },
					where: { userId: team.productOwnerUserId! },
				});
				const projectManager = await prisma.user.findUnique({
					select: { username: true },
					where: { userId: team.projectManagerUserId },
				});
				return {
					...team,
					productOwnerUsername: productOwnerId?.username,
					projectManagerUsername: projectManager?.username,
				};
			})
		);

		res.json(teamsWithUsernames);
	} catch (error: any) {
		res
			.status(500)
			.json({ message: `Error retrieving teams: ${error.message}` });
	}
};
