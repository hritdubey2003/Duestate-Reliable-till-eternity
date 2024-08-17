import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";


export const register = async ( req , res ) => {
    const { username , email , password } = req.body;
    try{    
        //Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log( hashedPassword )

        //CREATE USER AND SAVE TO MONGODB
        console.log("Hum aa gaya hoon tension mat lo");

        const newUser = await prisma.user.create({
            data: {
                  username,
                  email,
                  password: hashedPassword
            },
        });

        console.log( newUser );

        res.status(201).json({ message: "User created successfully!" });
    } catch ( error ) {
        console.log( error );
        res.status(500).json({ message: "Failed to crreate the User!" });
    }
};

export const login = async ( req , res ) => {
    const {username , password } = req.body;
    try {
    //Check if the user exists
        const user = await prisma.user.findUnique({
            where: {username}
        })

        if( !user ) return res.status(401).json({message: "Invalid credentials!"});
        //Check if the password is present
        const isPasswordValid = await bcrypt.compare( password , user.password );

    
        if ( !isPasswordValid ) return res.status(401).json({message: "Invalid credentials!"});
        const age = 1000 * 60 * 60 * 24 * 7;

        const token = jwt.sign( 
            {
                id: user.id,
                isAdmin: false,
            } , process.env.JWT_SECRET_KEY , { expiresIn: age }
        );

        const { password: userPassword , ...userInfo } = user;
        //Generate COOKIE TOKEN and send to the user
        // res.setHeader( "Set-Cookie" , "test=" + "myValue" ).json("Successful!");

        res.cookie("token" , token , {
            httpOnly: true,
            // secure: true We will use this secure true during the production as this moment we are only using localhost
            maxAge: age,
        } ).status(200).json(userInfo);

    } catch ( error ) {
        console.log( error );
        res.status(500).json({message: "Failed to login!"});
    }
    
}

export const logout = ( req , res ) => {
    res.clearCookie("token").status(200).json({message: "Logout Successful!"});
}