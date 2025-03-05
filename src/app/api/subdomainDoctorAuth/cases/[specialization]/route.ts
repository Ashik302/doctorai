import { PrismaClient } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// Interface for the user related to the symptom
interface User {
  email: string;
  name: string;
  userId: number;
  phoneNumber: string;
  Address: string;
}

// Complete Symptom interface including the user relation
interface Symptom {
  symptomId: number;
  summery: string;
  userId: number;
  user: User; // Relation to the User model
}


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ specialization: string }> }
) {
  try {
    const { specialization } = await params;

    if (!specialization) {
      return NextResponse.json(
        { error: "Specialization parameter is required" },
        { status: 400 }
      );
    }

    console.log("Specialization:", specialization);

    // Fetch all symptoms
    const symptoms = await prisma.symptom.findMany({
      include: {
        user: true, // Include user details
      },
    });

    console.log("Symptoms fetched:", symptoms);

    // Filter symptoms where the summary contains the specialization
    const filteredCases = symptoms.filter((symptom: Symptom) =>
      symptom.summery.toLowerCase().includes(specialization.toLowerCase())
    );

    console.log("This is filtered cases:", filteredCases);

    if (filteredCases.length === 0) {
      return NextResponse.json(
        { message: `No cases found for specialization: ${specialization}` },
        { status: 404 }
      );
    }

    // Structure the response
    const response = filteredCases.map((caseItem: Symptom) => ({
      caseId: caseItem.symptomId,
      patientName: caseItem.user.name,
      patientNumber: caseItem.user.phoneNumber,
      patientEmail: caseItem.user.email,
      patientAddress: caseItem.user.Address,
      symptomSummary: caseItem.summery,
      specialization: specialization,
    }));

    console.log("Filtered cases:", response);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error in GET /cases/specialization:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
