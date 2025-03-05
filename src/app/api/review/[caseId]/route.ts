import { PrismaClient } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient;

export async function POST(req: NextRequest) {

  const { content, doctorId, symptomId } = await req.json();
  console.log('these are the data', content, doctorId, symptomId);
  try {
    const review = await prisma.review.create({
      data: {
        content: content,
        symptom: {
          connect: {
            symptomId: symptomId,
          }
        },
        createdBy: {
          connect: {
            id: doctorId
          }
        }
      }
    })
    console.log(review)
    return NextResponse.json(review)
  } catch (error) {
    console.log("this the error adding review", error);
    return NextResponse.json(error)
  }

}

export async function GET(request: NextRequest, { params }: {
  params: Promise<{
    caseId: string
  }>
}) {
  const { caseId } = await params;

  try {
    if (!caseId) {
      return NextResponse.json({ message: "caseId is required." }, { status: 400 });
    }

    const reviews = await prisma.review.findMany({
      where: {
        symptomId: parseInt(caseId), // Filter reviews by symptomId
      },
      include: {
        createdBy: {
          select: {
            name: true,
            qualification: true,
            specialization: true,
          },
        },
        symptom: {
          select: {
            summery: true,
          },
        },
        reviewVote: {
          select: {
            createdById: true,
          },
        },
      },
    });

    if (!reviews || reviews.length === 0) {
      return NextResponse.json({ message: "No reviews found for this case." });
    }

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const { doctorId, reviewId } = await req.json()
  try {

    const voteStatus = await prisma.reviewVote.findFirst({
      where: {
        createdById: doctorId,
        createdToId: reviewId
      }
    })

    if (voteStatus) {

      const vote = await prisma.review.update({
        where: { id: reviewId },
        data: {
          voteCount: {
            decrement: 1
          }
        }
      })

      const voter = await prisma.reviewVote.deleteMany({
        where: {
          createdById: doctorId,
          createdToId: reviewId,
        }
      })

      console.log('vote and voter', vote, voter);
      return NextResponse.json({ voter, vote })
    } else {
      const vote = await prisma.review.update({
        where: { id: reviewId },
        data: {
          voteCount: {
            increment: 1
          }
        }
      })

      const voter = await prisma.reviewVote.create({
        data: {
          createBy: {
            connect: {
              id: doctorId
            }
          },
          createdTo: {
            connect: {
              id: reviewId
            }
          }
        }
      })

      console.log('vote and voter', vote, voter);
      return NextResponse.json({ voter, vote })
    }
  } catch (error) {
    console.log("this is error", error)
    return NextResponse.json(error)
  }
}