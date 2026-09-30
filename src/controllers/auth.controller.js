
const {
    registerUser,
    loginUser
} = require("../services/auth.service");


// Register a new user
const register = async (req, res) => {
    try {
        const { email, name, password } = req.body;

        const user = await registerUser({
            email,
            name,
            password
        });

        res.status(201).json({
            success: true,
            user
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// Login existing user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await loginUser(
            email,
            password
        );

        res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    register,
    login
};

