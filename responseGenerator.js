import { GoogleGenerativeAI } from "@google/generative-ai"


export async function chatResponse(prompt) {

  console.log("this is the api key", process.env.GEMINI_API_KEY);

  const gen_ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = gen_ai.getGenerativeModel({ model: "gemini-1.5-flash" });
  // console.log("this is prom the genertaor", prompt);
  try {
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "Hello" }],
        },
        {
          role: "model",
          parts: [
            {
              text: "Hello! I'm here to assist with any health concerns or questions you might have. Could you tell me more about what you're experiencing? I will generate max to max 50 to 100 character in each response",
            },
          ],
        },
      ],
    });

    const response = await chat.sendMessage(prompt.prompts);
    console.log("this is the ai generated response", response.response.text())
    return response.response.text();
  } catch (error) {
    console.log("error generating response", error)
  }
}

export async function summeryReponse(prompt) {
  console.log("this is the api key", process.env.GEMINI_API_KEY);

  const gen_ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = gen_ai.getGenerativeModel({ model: "gemini-1.5-flash" });
  try {
    const result = await model.generateContent(prompt.prompt)
    console.log("this is the prompt", prompt.prompt)
    console.log("this is the response", result.response.text())
    return result.response.text();
  } catch (error) {
    console.log("error generating content", error)
  }
}

export async function testDoctor(prompt) {
  const gen_ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = gen_ai.getGenerativeModel({ model: "gemini-1.5-flash" });
  console.log("this is hai this is ", prompt.prompt)
  try {
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [
            {
              text: `Hi I am a doctor and this is my details ${prompt.prompt} and i am here for the doctor test Please ask me medical advices and i will answer and after each asnwer ask me new medical questions.`
            }
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "Hi According to your data i will ve asking you medical advices without any other introduction and after each answer i will be asking you new medical advices.",
            },
          ],
        },
      ],
    });

    const response = await chat.sendMessage(prompt.prompt)
    console.log(response.response.text())
    return response.response.text();
  } catch (error) {
    console.log("error in generating the question", error)
  }
}

export async function qualificationDoctor(data) {
  const gen_ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = gen_ai.getGenerativeModel({ model: "gemini-1.5-flash" });
  console.log("this is the data hai data", data.data);
  try {
    const prompt =
      `
    This is the conversation which was done to check the qualification ${data.data},
    now analyse the conversation and provide uas the object as below: 
    dr: {
      level: //the level of the doctor knowledge,
      status: // this will be true or flase, if you think he is doctor then true else false and false if uer didnt response.
      description: // this will describe the doctor, about his field and all and wrap it up in 150 character
    }
      just provide the dr on json format so that i can acess the data as result.dr
      `
    const result = await model.generateContent(prompt)
    return result.response.text();
  } catch (error) {
    console.log("ERROR in finding the qualification", error)
  }
}