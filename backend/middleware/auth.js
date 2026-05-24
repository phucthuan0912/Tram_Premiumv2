import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    try {
        const { token } = req.headers;

        if (!token) {
            return res.json({ success: false, message: 'Not Authorized Login Again' });
        }

        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        const decodedId = tokenDecode?.id || tokenDecode?._id;
        if (!decodedId) {
            return res.json({ success: false, message: 'Invalid Token' });
        }

        req.authUserId = decodedId;
        req.userId = decodedId;
        req.tokenPayload = tokenDecode;
        req.body = req.body && typeof req.body === 'object' ? req.body : {};
        req.body.userId = decodedId;
        next();

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export default authUser;
