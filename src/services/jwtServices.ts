import Jwt  from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();


export const generateUserJWT = (userid: string, role = "user") => {
  return Jwt.sign({ id: userid, role }, process.env.SECRET as string, {
    expiresIn: "2h", 
  });
};

export const adminGenerateJWT = (adminEmail: string, role = "admin") => {
  return Jwt.sign({ email: adminEmail, role }, process.env.ADMIN_SECRET as string, {
    expiresIn: "4h",
  });
};

export const generateRefreshJWT = (userid: string, role = "user") => {
  return Jwt.sign({ id: userid, role }, process.env.REFRESH_SECRET as string, {
    expiresIn: "7d", 
  });
};

export const generateGoogleUserJWT = (userid: string, role = "user") => {
 
  return Jwt.sign({ id: userid, role }, process.env.SECRET as string, {
    expiresIn: "2h", 
  });
};




