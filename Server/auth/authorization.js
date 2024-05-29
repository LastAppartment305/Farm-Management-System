import jwt from 'jsonwebtoken';

export const authenticateToken=(req,res,next)=>{
    const authHeader=req.cookies.authToken;
    //const token=authHeader && authHeader.split(' ')[1];

    if (authHeader == null) return res.sendStatus(401);
    jwt.verify(authHeader,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
        if(err) return res.status(403).send(err);
        req.user=user;
        console.log(req.user);
        next();
    })
}

export const authRole=(role)=>{
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.sendStatus(403); // Forbidden
        }
        next();
    };
}