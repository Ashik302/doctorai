import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

const primsa = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const { res, userId } = await req.json();
        console.log(" this is the response hai response:  ", res)

        const addingSymptom = await primsa.symptom.create({
            data: {
                summery: res.response,
                user: {
                    connect :{
                        userId: parseInt(userId)
                    }
                }
            }
        })
        console.log("this is the symptom", addingSymptom)
        return NextResponse.json(addingSymptom)
    } catch (error) {
        console.log("ERROR occur in the symp db", error)
        return NextResponse.json(error)
    }
}