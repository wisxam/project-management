import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUsers = async (
	req: Request,
	res: Response // Get the response
): Promise<void> => {
	try {
		const users = await prisma.user.findMany(); // Use prisma and fetch data from database
		res.json(users); // In response return the json list
	} catch (error: any) {
		res
			.status(500)
			.json({ message: `Error retrieving users: ${error.message}` });
	}
};
