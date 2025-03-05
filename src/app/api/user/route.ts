import { PrismaClient } from "@prisma/client"
import { NextResponse, NextRequest } from "next/server";

const prisma = new PrismaClient;

export async function POST(req: NextRequest){
    try {
        const { data, status } = await req.json();
        console.log(" this is the data from frontend", data, status);
        console.log(" this is the tyoe of the number", typeof(parseInt(data.phone)));
        if(status === "log"){
            //
        }else{
            const adding = await prisma.user.create({
                data: {
                    name: data.name,
                    email: data.email,
                    phoneNumber: data.phone,
                    Address: data.address,
                }
            })

            const response = {
                ...adding,
                phoneNumber: adding.phoneNumber.toString(),
            };

            console.log("this is the error", response)
            return NextResponse.json(response)
        }
        
    } catch (error) {
        console.log("ERROR occur in the user adding section", error)
        return  NextResponse.json(error)
    }
}