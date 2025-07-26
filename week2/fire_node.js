const net = require("net");
const regions = [
    "Mallee", "Northern Country", "North East", "Wimmera",
    "North Central", "Central", "South West", "West and South Gippsland",
    "East Gippsland"
];

const host = "127.0.0.1";
const port = 6000;
const region = regions[Math.floor(Math.random() * regions.length)]; // Random region for this sensor

const warningLevels = [0, 1, 2, 3, 4, 5, 6]; // CFA warning levels

const client = net.createConnection(port, host, () => {
    console.log(`Connected (Reporting for ${region})`);
    setInterval(() => {
        const levelIndex = warningLevels[Math.floor(Math.random() * warningLevels.length)];
        client.write(`fire,${region},${levelIndex}`);
    }, 2000);
});

client.on("data", (data) => {
    console.log(`Received: ${data}`);
});

client.on("error", (error) => {
    console.log(`Error: ${error.message}`);
});

client.on("close", () => {
    console.log("Connection closed");
});