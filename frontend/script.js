// Function to clear the glow effect from all circles
function clearCircles() {
    document.getElementById('circleA').classList.remove('glow');
    document.getElementById('circleB').classList.remove('glow');
    document.getElementById('circleC').classList.remove('glow');
}

// Function to fetch the latest event from the backend and update the dashboard
async function fetchLatestEvent() {
    try {
        const response = await fetch('http://localhost:5000/latest_event');
        const data = await response.json();

        console.log("Fetched data:", data);

        // Clear previous circle highlights
        clearCircles();

        // Fetch the detection count for today
        const detectionCount = await fetchDetectionCount();

        // Update the dashboard with the latest detection info
        updateDashboard(data, detectionCount);

        // Highlight the corresponding sensor circle
        if (data.sensor_tag === 'A') {
            document.getElementById('circleA').classList.add('glow');
        } else if (data.sensor_tag === 'B') {
            document.getElementById('circleB').classList.add('glow');
        } else if (data.sensor_tag === 'C') {
            document.getElementById('circleC').classList.add('glow');
        }
    } catch (error) {
        console.error('Error fetching the latest event:', error);
    }
}

// Function to fetch detection count from the backend
async function fetchDetectionCount() {
    try {
        const response = await fetch('http://localhost:5000/detection_count');
        const data = await response.json();
        return data.count;
    } catch (error) {
        console.error('Error fetching detection count:', error);
        return 0;  // Fallback to 0 if there's an error
    }
}

// Function to update the dashboard with dynamic data
function updateDashboard(data, detectionCount) {
    // Get the current time
    const detectionTime = new Date(data.detection_time).toLocaleTimeString();

    // Update the dashboard content
    document.querySelector('.dashboard').innerHTML = `
        <h3>Elephant Detection Status</h3>
        <p>Detections Today: ${detectionCount}</p>
        <p>Last Detection: Sensor ${data.sensor_tag} at ${detectionTime}</p>
        <p>Sensors: A [${data.sensor_tag === 'A' ? 'Triggered' : 'OK'}], 
                    B [${data.sensor_tag === 'B' ? 'Triggered' : 'OK'}], 
                    C [${data.sensor_tag === 'C' ? 'Triggered' : 'OK'}]</p>
    `;
}

// Poll the backend every 5 seconds to get the latest detection event
setInterval(fetchLatestEvent, 1000);
