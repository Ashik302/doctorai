import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// Create Prisma client instance
const prisma = new PrismaClient();

// Remove the explicit type for the second argument
export async function GET(req: NextRequest,{ params }: { params: Promise<{ 
  id: string }> }) {
  const { id } = await params; // Access the id from context.params

  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id: parseInt(id) },
      include: { appointment: true },
    });

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    const serializedDoctor = {
      ...doctor,
      phoneNumber: doctor.phoneNumber,
    };

    return NextResponse.json(serializedDoctor);
  } catch (error) {
    console.error("Error fetching doctor:", error);
    return NextResponse.json({ error: "Failed to fetch doctor" }, { status: 500 });
  }
}
