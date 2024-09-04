const express = require('express');
const path = require('path');
const cluster = require('cluster');
const os = require('os');
const { mongoose } = require('./config/db');
const { queryUser } = require('./src/Routes/Userquery');
const { contactRouter } = require('./src/Routes/contactDetail');
const { privacyPolicyRouter } = require('./src/Routes/privacyPolicy');
const { slideRouter } = require('./src/Routes/slideRoute');
const { socialMediaRouter } = require('./src/Routes/medialinkRoute');
const { ourTeamrouter } = require('./src/Routes/ourTeam');
const { loginrouter } = require('./src/Routes/login');
const { Testimonialrouter } = require('./src/Routes/testimonialRoute');
const { authenticateToken } = require('./src/midilwhere/auth');

const app = express();
const port = 3000;

// Static files ko serve karne ke liye express static middleware use karenge
app.use(express.static(path.join(__dirname, 'public')));

// Agar koi route match nahi hota, toh index.html serve hoga
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const api = "/api";

// Routes
app.use(api, queryUser);
app.use(api, contactRouter);
app.use(api, privacyPolicyRouter);
app.use(api, slideRouter);
app.use(api, socialMediaRouter);
app.use(api, ourTeamrouter);
app.use(api, loginrouter);
app.use(api, Testimonialrouter);

// Protected route example
app.get('/api/protected', authenticateToken, (req, res) => {
    res.send('This is a protected route. User is authenticated.');
});

// Cluster setup
if (cluster.isMaster) {
    // Master process creates worker processes equal to the number of CPU cores
    const numCPUs = os.cpus().length;
    console.log(`Master process is running. Forking ${numCPUs} workers...`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Forking a new worker...`);
        cluster.fork(); // Fork a new worker when one dies
    });
} else {
    // Workers can share the same server port
    app.listen(port, () => {
        console.log(`Worker ${process.pid} is running on http://localhost:${port}`);
    });
}
