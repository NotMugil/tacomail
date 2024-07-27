import { db } from "@/lib/database";
import { NextResponse } from "next/server"

export async function POST(req: Request){
    try {
        const body = await req.json();
        const {email, username, password} = body

        console.log(email, username, password)


        const existingUserEmail = await db.user.findUnique({
            where: {email : email}
        });

        if(existingUserEmail) {
            return NextResponse.json({user: null, message: "email already exists"}, {status: 409})

        }

        const existingUsername = await db.user.findUnique({
            where: {email : email}
        });

        if(existingUsername) {
            return NextResponse.json({user: null, message: "user already exists"}, {status: 409})
        }

        const newUser = await db.user.create({
            data: {
                username,
                email,
                password
            }
        })

        return NextResponse.json(body);
    }catch(error){

    }
}




