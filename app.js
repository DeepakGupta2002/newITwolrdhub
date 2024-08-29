const express = require('express');
const path = require('path');
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
// app.use(authenticateToken);
// queryUser api
app.use(api, queryUser);
// contactRouter
app.use(api, contactRouter);
// Server ko listen karane ke liye

// privacyPolicyRouter

// app.use(api,contactRouter)
// app.use(api,contactRouter)
app.use(api, privacyPolicyRouter)
// slideRouter
app.use(api, slideRouter)
// socialMediaRouter api
app.use(api, socialMediaRouter);

app.use(api, ourTeamrouter);

// loginrouter
app.use(api, loginrouter);

app.use(api, Testimonialrouter)
app.get('/api/protected', authenticateToken, (req, res) => {
    res.send('This is a protected route. User is authenticated.');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
