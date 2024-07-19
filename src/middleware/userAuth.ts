import { Request, Response, NextFunction } from "express";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

interface CustomRequest extends Request {
  user?: string | JwtPayload;
}

interface JwtPayload {
  role: string;
  id?: string;
  email?: string;
}

const authenticateUserJwt = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.access_token || req.headers["authorization"];
 

  const actualToken = token && token.startsWith("Bearer ") ? token.slice(7) : token;
  if (!actualToken) {
    console.log("No token provided");
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(actualToken, process.env.SECRET as string) as JwtPayload;
    if (decoded.role !== "user") {
      return res.status(403).json({ message: "Forbidden" });
    }
    req.user = decoded;
    next();
  } catch (error:any) {
    console.error("Token verification error:", error.message);
    return res.status(401).json({ message: "Invalid Token" });
  }
};

export default authenticateUserJwt;