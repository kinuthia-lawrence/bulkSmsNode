const express = require('express');
const app = express();
const smsRouter = require('./textSmsController');

app.use(express.json());
app.use('/api/textsms', smsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>console.log(`Server is running on port ${PORT}`));