import { db } from "@/lib/database";
import { hash } from 'bcrypt';  
import { NextResponse } from "next/server"

// export async function GET() {
//     return NextResponse.json({success:true})
// }

export async function POST(req: Request){
    try {
        const body = await req.json();
        const {email, username, password} = body;

        console.log(email, username, password)


        const existingUserEmail = await db.user.findUnique({
            where: {email : email}
        });

        if(existingUserEmail) {
            return NextResponse.json({user: null, message: "email already exists"}, {status: 409})

        }

        const existingUsername = await db.user.findUnique({
            where: {username : username}
        });

        if(existingUsername) {
            return NextResponse.json({user: null, message: "user already exists"}, {status: 409})
        }


        const hashedPassword = await hash(password, 10);
        const newUser = await db.user.create({
            data: {
                username,
                email,
                password : hashedPassword
            }
        })

        const { password : newUserPassword, ...rest } = newUser

        return NextResponse.json({user:newUser, messsage: "user created"}, {status: 201});
    }catch(error){

    }
}




