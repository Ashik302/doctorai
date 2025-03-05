import { PrismaClient } from "@prisma/client"; // Import PrismaClient
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { dorData, resultDesc } = await req.json();
  try {
    const response = await prisma.doctor.create({
      data: {
        name: `Dr. ${dorData.name}`,
        email: dorData.email,
        location: dorData.location,
        experience: parseInt(dorData.experience),
        phoneNumber: dorData.phone, // Now stored as a string
        specialization: dorData.specialization,
        qualification: dorData.qualifications,
        resultDesc: resultDesc,
        loginCode: dorData.loginCode,
      },
    });
    console.log("Doctor created successfully:", response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error creating doctor:", error);
    return NextResponse.json(error, { status: 500 });
  }
}


export async function GET() {
  try {
    const doctors = await prisma.doctor.findMany();
    // No need to convert phoneNumber to string
    console.log("Doctors fetched successfully:", doctors);
    return NextResponse.json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return NextResponse.json({ error: "Failed to fetch doctors" }, { status: 500 });
  }
}
