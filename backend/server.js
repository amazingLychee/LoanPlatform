const express = require('express');
const mongoose = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const loanRoutes = require('./routes/loanRoutes');
// const ruleEngineRoutes = require('./routes/ruleEngineRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const adminRoutes = require('./routes/adminRoutes');


const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/users', userRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/admin', adminRoutes);
// app.use('/api/', adminRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
