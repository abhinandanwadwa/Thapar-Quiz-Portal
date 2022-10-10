const express = require('express');
const router = express.Router();
const UserSchema = require('../models/User');
const { body, validationResult, check } = require('express-validator');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const dotenv = require('dotenv');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;



// Route 1: Registering A New User: POST: http://localhost:8181/api/auth/register. No Login Required
router.post("/register", [
    body('name', "Full Name should be at least 3 characters.").isLength({ min: 3 }),
    body('email', "Please Enter a Vaild Email").isEmail(),
    body('role', "Please Enter a Vaild Role").notEmpty(),
    body('institute', "Please Enter a Vaild Institute").notEmpty(),
    body('password', "Password Should Be At Least 8 Characters.").isLength({ min: 8 }),
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const checkAlreadyExistingUser = await UserSchema.findOne({ email: req.body.email });
        if (checkAlreadyExistingUser) {
            return res.status(403).json({ error: "A user with this email id already exist" });
        }

        let salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(req.body.password, salt);
        const newUser = await UserSchema.create({
            name: req.body.name,
            email: req.body.email,
            role: req.body.role,
            institute: req.body.institute,
            password: hash,
        });
        
        let payload = {
            user: {
                id: newUser.id
            }
        }

        const authtoken = jwt.sign(payload, JWT_SECRET);
        res.json({ authtoken });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});







































// Route 2: Authenticating an existing user: POST: http://localhost:8181/api/auth/login. No Login Required
router.post("/login", [
    body('email', "Please Enter a Vaild Email").isEmail(),
    body('password', "Password Should Be At Least 8 Characters.").isLength({ min: 8 }),
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const theUser = await UserSchema.findOne({ email: req.body.email });
        if (theUser) {
            // console.log(checkEmailExists);
            let checkHash = await bcrypt.compare(req.body.password, theUser.password);
            if (checkHash) {
                let payload = {
                    user: {
                        id: theUser.id
                    }
                }
                const authtoken = jwt.sign(payload, JWT_SECRET);
                return res.status(200).json({authtoken});
            }
            else {
                return res.status(403).json({ error: "Invalid Credentials" });
            }
        }
        else {
            return res.status(403).json({ error: "Invalid Credentials" });
        }


    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});






























// Route 3: Getting loggedin user details: GET: http://localhost:8181/api/auth/user. No Login Required
router.get('/user', fetchuser, async (req, res) => {
    const user_id = req.user.id;
    try {
        const theUser = await UserSchema.findById(user_id).select("-password");
        if (!theUser) {
            return res.status(400).json({ error: "Some Error Occurred. Please try again later." });   
        }

        return res.status(200).json(theUser);


    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;