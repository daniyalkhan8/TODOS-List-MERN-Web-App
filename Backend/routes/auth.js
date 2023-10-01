const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchUser')

const JWT_SECERET = "Harryisagoodb$oy";

// ROUTE 1: Create a user using POST "/api/auth/createuser". It is for creating a user. No login required.
router.post('/createuser', [
    body('name', 'Name should have atleast 3 characters.').isLength({ min: 3 }),
    body('email', 'Enter a valid email.').isEmail(),
    body('password', 'Password should have atleast 8 characters.').isLength({ min: 8 })
], async (req, res) => {
    let success = false;

    // Validating if the credential are valid.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    try {
        // Checking if the user already exist
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success, error: "The user with this email already exist." });
        }

        // Creating a secure password
        const salt = await bcrypt.genSalt(10);
        const securePass = await bcrypt.hash(req.body.password, salt);

        // Creating the user.
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: securePass
        });

        // Creating a JWT Authentication Token and sending it to the user.
        const data = {
            user: {
                id: user.id
            }
        }
        success = true;
        const authToken = jwt.sign(data, JWT_SECERET);
        res.json({ success, authToken });
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error.");
    }

})


// ROUTE 2: Authenticate a user using POST "/api/auth/login". It is for user login. No login required.
router.post('/login', [
    body('email', 'Enter a valid email.').isEmail(),
    body('password', 'The password should not be blank.').exists()
], async (req, res) => {
    let success = false;

    // Validating if the credentials are valid.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    // Fetching email and password from request.
    const { email, password } = req.body;

    try {
        // Checking if the user exist or not.
        let user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ success, error: "Please try to login with corret credentials." });
        }

        // Comparing the password entered and password stored.
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ success, error: "Please try to login with corret credentials." });
        }

        // Creating a JWT Authentication Token and sending it to the user.
        const data = {
            user: {
                id: user.id
            }
        };

        success = true;
        const authToken = jwt.sign(data, JWT_SECERET);
        res.json({ success, authToken });
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error.");
    }
});

// ROUTE 3: Get logged in user's details using POST "/api/auth/getuser". Login required.
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password');
        res.send(user);
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error.");
    }
});

module.exports = router;