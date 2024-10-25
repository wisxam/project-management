import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { User } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authenticateToken = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	const token = req.headers["authorization"]?.split(" ")[1];

	if (!token) {
		res.status(401).json({ error: "Unauthorized: No Token Provided" });
		return;
	}

	jwt.verify(token, JWT_SECRET, (err, decoded) => {
		if (err) {
			res.status(403).json({ error: "Invalid Token" });
			return;
		}

		// Use type assertion to tell TypeScript the type of decoded
		const user = decoded as User; // Ensure User is correctly defined as per your application

		// Optional: Check if the user object matches the expected structure
		if (!user || typeof user.userId !== "number") {
			res.status(403).json({ error: "Invalid Token Structure" });
			return;
		}

		req.user = user; // Now TypeScript understands the structure of req.user
		next();
	});
};
