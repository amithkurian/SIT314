const net = require("net");

const port = 5000;

const server = net.createServer((socket) => {
    console.log("Client connected");

    socket.on("data", (data) => {
        try {
            const strData = data.toString();
            console.log(`Received: ${strData}`);

            const command = strData.split(",");
            const operator = command[0];
            const operand1 = parseFloat(command[1]);
            const operand2 = parseFloat(command[2]);
            let result;

            switch (operator.toLowerCase()) {
                case "add":
                    result = operand1 + operand2;
                    break;
                case "sub":
                    result = operand1 - operand2;
                    break;
                case "mul":
                    result = operand1 * operand2;
                    break;
                case "div":
                    if (operand2 === 0) throw new Error("Division by zero");
                    result = operand1 / operand2;
                    break;
                case "pow":
                    result = Math.pow(operand1, operand2);
                    break;
                case "sqrt":
                    result = Math.sqrt(operand1);
                    break;
                case "log":
                    result = Math.log(operand1);
                    break;
                default:
                    throw new Error(`Unknown operator: ${operator}`);
            }

            console.log(`Calculation Result: ${result}`);
            socket.write(result.toString());
        } catch (error) {
            console.error(`Error processing request: ${error.message}`);
            socket.write(`Error: ${error.message}`);
        }
    });

    socket.on("end", () => {
        console.log("Client disconnected");
    });

    socket.on("error", (error) => {
        console.log(`Socket Error: ${error.message}`);
    });
});

server.on("error", (error) => {
    console.log(`Server Error: ${error.message}`);
});

server.listen(port, () => {
    console.log(`TCP socket server is running on port: ${port}`);
});