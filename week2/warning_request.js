const net = require("net");
const readline = require("readline");

const regions = [
    "Mallee", "Northern Country", "North East", "Wimmera",
    "North Central", "Central", "South West", "West and South Gippsland",
    "East Gippsland"
];

const host = "127.0.0.1";
const port = 6000;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function connectToServer() {
    const client = net.createConnection(port, host, () => {
        console.log("Connected to weather service");
        askRegion();
    });

    function askRegion() {
        console.log("\nAvailable regions:");
        regions.forEach((region, index) => {
            console.log(`${index + 1}. ${region}`);
        });
        
        rl.question("\nEnter region number to monitor (or 'q' to quit): ", (answer) => {
            if (answer.toLowerCase() === 'q') {
                client.end();
                rl.close();
                return;
            }

            const index = parseInt(answer) - 1;
            if (index >= 0 && index < regions.length) {
                const region = regions[index];
                console.log(`Monitoring ${region}...`);
                
                setInterval(() => {
                    client.write(`request,${region},0`);
                }, 2000);
            } else {
                console.log("Invalid region number");
                askRegion();
            }
        });
    }

    client.on("data", (data) => {
        console.log(`\n${data}`);
    });

    client.on("error", (error) => {
        console.log(`Error: ${error.message}`);
    });

    client.on("close", () => {
        console.log("Connection closed");
        rl.close();
    });
}

connectToServer();