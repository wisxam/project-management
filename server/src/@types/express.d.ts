// src/@types/express.d.ts

import * as express from "express";
import { User } from "./user.types";

declare global {
	namespace Express {
		interface Request {
			user?: User;
		}
	}
}
