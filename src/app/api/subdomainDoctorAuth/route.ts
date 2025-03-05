import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
interface Doctor {
    specialization: string;
    name: string;
    email: string;
    phoneNumber: string;
    resultDesc: string;
    id: number;
    location: string;
    experience: number;
    qualification: string;
    loginCode: string;
}
export async function GET() {
    try {
        const doctors = await prisma.doctor.findMany();
        console.log("this is doctor", doctors)
        const subdomains = doctors.map((doctor: Doctor) => {
            const sanitizedName = doctor.name.replace(/[^a-zA-Z0-9]/g, "").trim();
            return `${sanitizedName.toLowerCase()}-${doctor.id}`;  // Append doctor ID for uniqueness
        });
        
        const uniqueSubdomains = [...new Set(subdomains)];
        
        console.log('this id from ', uniqueSubdomains)
        return NextResponse.json({ subdomains: uniqueSubdomains });
    } catch (error) {
        console.error("Error fetching doctor data:", error);

        return NextResponse.json(
            {
                status: 500,
                message: "Failed to fetch doctor data",
                error: error,
            },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}


export async function POST(req: NextRequest) {
    const { email, loginCode } = await req.json();
    try {
        const doctor = await prisma.doctor.findUnique({
            where: {
                email: email,
            },
            include: { appointment: true }
        })
        console.log("this is from backend", doctor)
        if (doctor?.loginCode !== loginCode) {
            return NextResponse.json({ message: "Unauthorized user" })
        }
        return NextResponse.json(JSON.parse(JSON.stringify(doctor, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
        )))
    } catch (error) {
        console.log("error in the subdomainauth", error)
        return NextResponse.json(error)
    }
}