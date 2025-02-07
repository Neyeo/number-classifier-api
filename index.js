const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());

// Function to check if a number is prime
const isPrime = (num) => {
    if (num < 2 || !Number.isInteger(num)) return false;
    for (let i = 2; i * i <= num; i++) {
        if (num % i === 0) return false;
    }
    return true;
};

// Function to check if a number is perfect
const isPerfect = (num) => {
    if (!Number.isInteger(num)) return false;
    let sum = 1;
    for (let i = 2; i * i <= num; i++) {
        if (num % i === 0) {
            sum += i;
            if (i !== num / i) sum += num / i;
        }
    }
    return sum === num && num !== 1;
};

// Function to check if a number is an Armstrong number
const isArmstrong = (num) => {
    if (!Number.isInteger(num)) return false;
    const digits = num.toString().split("").map(Number);
    const power = digits.length;
    const sum = digits.reduce((acc, d) => acc + Math.pow(d, power), 0);
    return sum === num;
};

// Function to get properties of the number
const getProperties = (num) => {
    const properties = [];
    if (!Number.isInteger(num)) {
        properties.push("floating-point");
    } else {
        if (isArmstrong(num)) properties.push("armstrong");
        properties.push(num % 2 === 0 ? "even" : "odd");
    }
    return properties;
};

// Function to get the sum of digits
const getDigitSum = (num) => {
    if (!Number.isInteger(num)) return null;
    return num.toString().split("").reduce((sum, digit) => sum + parseInt(digit), 0);
};

// Route to classify the number
app.get("/api/classify-number", async (req, res) => {
    const { number } = req.query;

    // Validate input
    if (!number || isNaN(number)) {
        return res.status(400).json({
            number,
            error: true,
            message: "Invalid input. Please provide a valid number."
        });
    }

    const num = Number(number);

    try {
        // Fetch a fun fact from Numbers API
        const factResponse = await axios.get(`http://numbersapi.com/${Math.floor(num)}/math?json`);
        const funFact = factResponse.data.text || "No fact available.";

        res.json({
            number: num,
            is_prime: isPrime(num),
            is_perfect: isPerfect(num),
            properties: getProperties(num),
            digit_sum: getDigitSum(num),
            fun_fact: funFact,
        });
    } catch (error) {
        res.json({
            number: num,
            is_prime: isPrime(num),
            is_perfect: isPerfect(num),
            properties: getProperties(num),
            digit_sum: getDigitSum(num),
            fun_fact: "Fun facts are only available for whole numbers."
        });
    }
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
