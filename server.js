import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { chatResponse, qualificationDoctor, testDoctor } from "./responseGenerator.js";
import { summeryReponse } from "./responseGenerator.js";

const dev = true;
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });

const handler = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer(handler);

    const io = new Server(httpServer);

    io.on("connection", (socket) => {
        // ..
        console.log("user connected", socket.id);
        socket.on("symptoms", async (prompt) => {
            // console.log("this is the symptooms data", prompt);
            const response = await chatResponse(prompt);
            console.log("this is the response in the backend", response)
            socket.emit("symp_response", { response });
        })

        socket.on("summery", async (prompt) => {
            const response = await summeryReponse(prompt);
            socket.emit("summery_response", { response })
        })

        socket.on("doctor-regi", async (prompt) => {
            console.log("this is from server file", prompt)
            const response = await testDoctor(prompt)
            // console.log("from server", repsonse)
            socket.emit("doctor-test", { response })
        })
        
        socket.on("test-doctor", async (data) => {
            console.log("this is that that that", data);
            const response = await qualificationDoctor(data)
            console.log(response)
           socket.emit("doctor-result", {response})
        })
    });

    httpServer.once("error", err => {
        console.error(err);
        process.exit(1);
    }).listen(
        port, () => {
            console.log(`> Ready on http://${hostname}:${port}`)
        }
    )
});
