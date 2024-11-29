const jwt = require('jsonwebtoken');
const userModules = require("../src/user/modules.js");
module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;

        const user = await userModules.getUserid(req.userData.userId); 

        if (!user || !user[0].type === "admin") {
            res.status(403).json({
                message: "Access denied! User is not an admin.",
                user: user[0].role
            });
        }



        next();
    } catch (error) {
        return res.status(401).json({
            message: "Auth faild",
            error: error
        });
    }
};