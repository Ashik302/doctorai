import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    console.log("this is id", id)
    const user = await prisma.user.findUnique({
      where: {
        userId: parseInt(id),
      },
      include: {
        appointment: {
          include: {
            doctor: true, 
          },
        },
        symptom: {
          include: {
            review: true, 
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("This is the required user:", user);
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error getting the individual user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
