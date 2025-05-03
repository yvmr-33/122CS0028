const express = require('express');
const axios = require('axios');

const app = express();
const port = 9876;
const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ2MjgyMjYwLCJpYXQiOjE3NDYyODE5NjAsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjlhZGRhMzNkLTViYzEtNDUwZC05NDBkLTlmOTEyNDJlZDc0OCIsInN1YiI6IjEyMmNzMDAyOEBpaWl0ay5hYy5pbiJ9LCJlbWFpbCI6IjEyMmNzMDAyOEBpaWl0ay5hYy5pbiIsIm5hbWUiOiJ5ZXJ1dmEgdmVua2F0YSBtYWhlc2ggcmVkZHkiLCJyb2xsTm8iOiIxMjJjczAwMjgiLCJhY2Nlc3NDb2RlIjoiYnpiQ256IiwiY2xpZW50SUQiOiI5YWRkYTMzZC01YmMxLTQ1MGQtOTQwZC05ZjkxMjQyZWQ3NDgiLCJjbGllbnRTZWNyZXQiOiJkc2FVZEpEQmZ4cUF5UGJVIn0.fPieayMyfnWXJ2AqUy_q0D7mIgmvCPgxeEqJ-60Su8Y";
// const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ2MjgxOTc4LCJpYXQiOjE3NDYyODE2NzgsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjlhZGRhMzNkLTViYzEtNDUwZC05NDBkLTlmOTEyNDJlZDc0OCIsInN1YiI6IjEyMmNzMDAyOEBpaWl0ay5hYy5pbiJ9LCJlbWFpbCI6IjEyMmNzMDAyOEBpaWl0ay5hYy5pbiIsIm5hbWUiOiJ5ZXJ1dmEgdmVua2F0YSBtYWhlc2ggcmVkZHkiLCJyb2xsTm8iOiIxMjJjczAwMjgiLCJhY2Nlc3NDb2RlIjoiYnpiQ256IiwiY2xpZW50SUQiOiI5YWRkYTMzZC01YmMxLTQ1MGQtOTQwZC05ZjkxMjQyZWQ3NDgiLCJjbGllbnRTZWNyZXQiOiJkc2FVZEpEQmZ4cUF5UGJVIn0.cwC3CGexNFMWFAeG5_MfPzKjaBR_qQkxTSurX1x6pXc";
let windowCurrState = [];
app.get('/', async (req, res) => {
    res.send("user the formated url");
});


const numberTypes = new Map([
    ['p', 'primes'],
    ['f', 'fibo'],
    ['e', 'even'],
    ['r', 'rand']
]);

app.get('/numbers/:Id', async (req, res) => {
    // const { Id } = req.params;
    const Id = req.params.Id;
    if (!numberTypes.has(Id)) {
        return res.status(400).json({ error: 'Invalid number type.' });
    }
    const type = numberTypes.get(Id);
    console.log(type);
    const url = `http://20.244.56.144/evaluation-service/${type}`;
    try {
        // const response = await axios.get(url);
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });
        const newNumbers = response.data.numbers;

        const windowPrevState = [...windowCurrState];

        for (const num of newNumbers) {
            if (!windowCurrState.includes(num)) {
                windowCurrState.push(num);
            }
            if (windowCurrState.length > 10) {
                windowCurrState.shift();
            }
        }

        const average =
            windowCurrState.reduce((sum, num) => sum + num, 0) / windowCurrState.length;

        res.json({
            windowPrevState: windowPrevState,
            windowCurrState: windowCurrState,
            numbers: newNumbers,
            avg: Number(average),
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to fetch numbers' });
    }
    // res.send("rnv")
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
