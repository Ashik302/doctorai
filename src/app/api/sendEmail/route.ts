import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { userId, doctorId, subject, content } = await req.json();
    console.log("Received Data:", userId, doctorId, subject, content);

    if (!userId || !doctorId || !subject || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    
    const user = await prisma.user.findUnique({
      where: {
        userId: userId,
      },
    });
    
    const doctor = await prisma.doctor.findUnique({
      where: {
        id: doctorId,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userEmail = user?.email;
    const doctorEmail = doctor?.email;
    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ashikkoirala68@gmail.com", 
        pass: 'vlrf iqbf than wksd', 
      },
    });

    console.log("process", "ashikkoirala68@gmail.com", 'vlrf iqbf than wksd')

    
    const mailOptions = {
      from: "ashikkoirala68@gmail.com",
      subject: subject,
      text: content,
      bcc: [userEmail, doctorEmail].filter(email => email !== undefined),  // Filter out undefined values
    };
    
    await transporter.sendMail(mailOptions);
    

    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
