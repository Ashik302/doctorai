import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";


const prisma = new PrismaClient;

export async function POST(req: NextRequest) {
  try {
    const { appointmentData, doctorId, userId } = await req.json()
    console.log("this is thje data", appointmentData, doctorId, userId);

    const appointment = await prisma.appointment.create({
      data: {
        date: appointmentData.date,
        time: appointmentData.time,
        reason: appointmentData.cause,
        user: {
          connect: {
            userId: userId
          }
        },
        doctor: {
          connect: {
            id: doctorId,
          }
        },
      }
    })

    console.log("this is the response while adding the apointment", appointment)
    return NextResponse.json(appointment)
  } catch (error) {
    console.log("error adding the appointment", error)
    return NextResponse.json(error)
  }
}


export async function PATCH(req: NextRequest) {
  try {
    const { id, action, newDate } = await req.json();
    console.log("Updating appointment with ID:", id, "Status:", action);



    if (action === "accept") {
      const updatedAppointment = await prisma.appointment.update({
        where: {
          id: id,
        },
        data: {
          status: action,
        }
      });


      console.log("Appointment updated successfully:", updatedAppointment);
      return NextResponse.json(updatedAppointment);
    } else if (action === "decline") {

      const updatedAppointment = await prisma.appointment.update({
        where: {
          id: id,
        },
        data: {
          status: 'postponed',
          date: newDate
        }
      });

      console.log("Appointment updated successfully:", updatedAppointment);
      return NextResponse.json(updatedAppointment);
    } else {
      return NextResponse.json(
        { error: "Invalid status. Must be 'accepted' or 'declined'." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log("Error updating the appointment:", error);
    return NextResponse.json({ error: "Error updating the appointment" }, { status: 500 });
  }
}

const sendEmail = async (userId: number, doctorId: number ,subject: string, content: string) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sendEmail`, {
      userId,
      doctorId,
      subject,
      content,
    });
    console.log('this is the dbkasjbd', response);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};

export async function GET() {
  try {
    const currentDate = new Date().toISOString().split("T")[0];


    const appointments = await prisma.appointment.findMany();

    for (const appointment of appointments) {

      if (appointment.date < currentDate) {
        const deleteAppointment = await prisma.appointment.delete({ where: { id: appointment.id } });
        if (deleteAppointment.status === "Pending") {
  
          const doctorContent = `
          Hey there ,
  
          The pending appointment have been expired.
  
          **Appointment Details:**  
          - **Date & Time:** ${appointment.date} at ${appointment.time}  
          - **Reason:** ${appointment.reason || "No reason provided"}  
  
          Best regards,  
          Appointment Management Team
          doctorai!
          `;
  
  
          await sendEmail(appointment.userId, appointment.doctorId,  "Appointment expired", doctorContent);
        }
        console.log(`Deleted expired appointment: ${appointment.id}`);
        continue;
      }else {
        console.log("NO OUTDATED APPOINTMENTS")
      }


    }

    return NextResponse.json({ message: "Checked and processed appointments." });
  } catch (error) {
    console.error("Error in checking appointments:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}