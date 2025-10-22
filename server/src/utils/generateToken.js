import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
  try {

    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    
  } catch (error) {
        console.log("JWT Generation Error:", error);
        return null;
    } 
};

