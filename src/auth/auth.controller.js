import User from '../users/user.model.js';
import {  verify } from 'argon2';
import { generateJWT } from "../helpers/generate-jwt.js"
import argon2 from 'argon2';
export const login = async (req, res) => {
    const {email, password, username} = req.body;
    try {
        const user = await User.findOne({
            $or: [
                { email },
                { username }
            ]
        })
        if (!user) {
            return res.status(400).json({
                msg: 'Incorrect credentials, email does not exist in the database'
            })
        }
        if (!user.status) {
            return res.status(400).json({
                msg: 'The user does not exist in the database'
            })
        }

        const validPassword = await verify(user.password, password)
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Password is incorrect'
            })
        }

        const token = await generateJWT(user.id)

        res.status(200).json({
            msg: 'Successful login',
            userDetails: {
                username: user.username,
                token : token
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            msg: "Contact the administrator",
            error: e.message
        })
    }
}



export const createAdmin = async () => {
    try {
        const existAdmin = await User.findOne({ name: "Admin" });
        
        if (!existAdmin) {
            const hashed = await argon2.hash("12345678");
            const adminUser = new User({
                name: "Admin",
                surname: "admin",
                username: "ADMIN",
                email: "admin@gmail.com",
                phone: "12345667",
                password: hashed,
                isAdmin: true
            });

            await adminUser.save();
            console.log("Admin user created successfully");
        } 
    } catch (error) {
        console.error("Error creating admin:", error);
    }
};

export const getUsers = async (req = request, res = response) => {
    try {
      const { limite = 10, desde = 0 } = req.query;
      const query = { status: true };
  
      const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
          .skip(Number(desde))
          .limit(Number(limite))
  
      ]);
  
      res.status(200).json({
        success: true,
        total,
        users
      });
  
    } catch (error) {
      res.status(500).json({
        success: false,
        msg: "Error getting users",
        error
      });
    }
  };