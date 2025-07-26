const net = require("net");

const host = "127.0.0.1";
const port = 5000;

const operations = [
    { op: "add", range: [1, 100] },
    { op: "sub", range: [1, 100] },
    { op: "mul", range: [1, 20] },
    { op: "div", range: [1, 10] },
    { op: "pow", range: [1, 5] },
    { op: "sqrt", range: [1, 100] },
    { op: "log", range: [1, 100] }
];

const getRandomOperation = () => {
    const randomOp = operations[Math.floor(Math.random() * operations.length)];
    const num1 = (Math.random() * (randomOp.range[1] - randomOp.range[0]) + randomOp.range[0]).toFixed(2);
    
    // Some operations only need one operand
    if (randomOp.op === "sqrt" || randomOp.op === "log") {
        return `${randomOp.op},${num1}`;
    }
    
    const num2 = (Math.random() * (randomOp.range[1] - randomOp.range[0]) + randomOp.range[0]).toFixed(2);
    return `${randomOp.op},${num1},${num2}`;
};

const client = net.createConnection(port, host, () => {
    console.log("Connected");
    setInterval(() => {
        const operation = getRandomOperation();
        console.log(`Sending: ${operation}`);
        client.write(operation);
    }, 2000); // Send a random operation every 2 seconds
});

client.on("data", (data) => {
    console.log(`Result: ${data.toString()}`);
});

client.on("error", (error) => {
    console.log(`Error: ${error.message}`);
});

client.on("close", () => {
    console.log("Connection closed");
});