const net = require("net");
const regions = [
    "Mallee", "Northern Country", "North East", "Wimmera",
    "North Central", "Central", "South West", "West and South Gippsland",
    "East Gippsland"
];

const host = "127.0.0.1";
const port = 6000;
const region = regions[Math.floor(Math.random() * regions.length)]; // Random region for this sensor

const client = net.createConnection(port, host, () => {
    console.log(`Connected (Reporting for ${region})`);
    setInterval(() => {
        const rain = Math.floor(Math.random() * 200) + 1;
        client.write(`rain,${region},${rain}`);
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