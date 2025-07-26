const net = require("net");
const port = 6000;

// CFA regions in Victoria
const regions = [
    "Mallee", "Northern Country", "North East", "Wimmera",
    "North Central", "Central", "South West", "West and South Gippsland",
    "East Gippsland"
];

// Data storage per region
const regionData = {};
regions.forEach(region => {
    regionData[region] = {
        temp: null,
        wind: null,
        rain: null,
        fireLevel: 0
    };
});

const fireLevelNames = [
    "No Fire Danger",
    "Moderate",
    "High",
    "Very High",
    "Severe",
    "Extreme",
    "Code Red"
];

const server = net.createServer((socket) => {
    console.log("Client connected");

    socket.on("data", (data) => {
        const strData = data.toString().trim();
        console.log(`Received: ${strData}`);

        const parts = strData.split(",");
        const command = parts[0];
        let result;

        try {
            switch (command) {
                case "temp":
                case "rain":
                case "wind":
                case "fire":
                    const region = parts[1];
                    const value = parseFloat(parts[2]);
                    
                    if (!regions.includes(region)) {
                        throw new Error("Invalid region");
                    }
                    
                    regionData[region][command] = value;
                    result = "ok";
                    break;

                case "request":
                    const requestRegion = parts[1];
                    
                    if (!regions.includes(requestRegion)) {
                        throw new Error("Invalid region");
                    }
                    
                    const data = regionData[requestRegion];
                    let weatherWarning = false;
                    let fireWarning = false;
                    
                    if (data.temp > 20 && data.rain < 50 && data.wind > 30) {
                        weatherWarning = true;
                    }
                    
                    if (data.fireLevel >= 4) {
                        fireWarning = true;
                    }
                    
                    if (weatherWarning && fireWarning) {
                        result = `${requestRegion}: Dual Warning - Extreme Weather and ${fireLevelNames[data.fireLevel]} Fire Danger`;
                    } else if (weatherWarning) {
                        result = `${requestRegion}: Weather Warning`;
                    } else if (fireWarning) {
                        result = `${requestRegion}: Fire Warning - ${fireLevelNames[data.fireLevel]}`;
                    } else {
                        result = `${requestRegion}: Conditions Normal`;
                    }
                    break;

                default:
                    throw new Error("Invalid command");
            }
        } catch (error) {
            result = `Error: ${error.message}`;
        }

        socket.write(result.toString());
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
    console.log(`Supported regions: ${regions.join(", ")}`);
});