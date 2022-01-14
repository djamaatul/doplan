require('dotenv').config();

const port = process.env.PORT;

const express = require('express');
const app = express();
const cors = require('cors');

const router = require('./src/routes');

app.use('/api/v1/', router);
app.use(cors());
app.use((req, res) => {
	res.send('request not found');
});

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});
