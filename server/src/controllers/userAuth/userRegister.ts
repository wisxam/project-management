import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET as string;

export const registerUser = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { username, password } = req.body;
	const hashedPassword = await bcrypt.hash(password, 10);

	try {
		const user = await prisma.user.create({
			data: {
				username,
				password: hashedPassword,
			},
		});
		res.json(user);
	} catch (error) {
		res.status(400).json({ error: "User Already Exists" });
	}
};

export const loginUser = async (req: Request, res: Response) => {
	const { username, password } = req.body;

	const user = await prisma.user.findUnique({
		where: { username },
	});

	if (!user || !(await bcrypt.compare(password, user.password))) {
		return res.status(400).json({ error: "Invalid credentials" });
	}

	const token = jwt.sign({ userId: user.userId }, JWT_SECRET, {
		expiresIn: "3h",
	});

	res.json({ token });
};
