import { Request, Response, NextFunction } from "express";
import dotenv from 'dotenv';
import jwt, { Secret } from 'jsonwebtoken';
dotenv.config();

interface CustomRequest extends Request {
  user?: string | JwtPayload;
}

interface JwtPayload {
  role: string;
  id?: string;
  email?: string;

}

export const authenticateAdminJwt = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization || req.query.token || req.cookies.token;
  
  console.log("Token received:", token);
  
  const actualToken = token && token.startsWith("Bearer ") ? token.slice(7) : token;
  
  if (!actualToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  console.log("Actual token:", actualToken);
  
  try {
    const decoded = jwt.verify(actualToken, process.env.ADMIN_SECRET as string) as JwtPayload;
    
    console.log("Decoded token:", decoded);
    
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    
    req.user = decoded;
    next();
  } catch (error: any) {
    console.error("Token verification error:", error.message);
    return res.status(401).json({ message: "Invalid Token" });
  }
};
