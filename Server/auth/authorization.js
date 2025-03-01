import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.cookies.authToken;
  //const token=authHeader && authHeader.split(' ')[1];

  if (authHeader == null) return res.sendStatus(401);
  jwt.verify(authHeader, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).send(err);
    req.user = user;
    console.log(req.user);
    next();
  });
};

export const authRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.sendStatus(403); // Forbidden
    }
    next();
  };
};

export const workerAuthToken = (req, res, next) => {
  const authHeader = req.cookies.workerAuth;
  // console.log(authHeader);
  if (authHeader == null) return res.sendStatus(401);
  console.log("worker process secret token", process.env.WORKER_TOKEN_SECRET);
  jwt.verify(authHeader, process.env.WORKER_TOKEN_SECRET, (err, worker) => {
    if (err) return res.status(403).send(err);
    console.log(worker);
    req.worker = worker;
    // res.json({ id: req.worker.farmid });
    next();
  });
};

export const analystAuth = (req, res, next) => {
  const authHeader = req.cookies.analystToken;

  if (authHeader == null) return res.sendStatus(401);
  jwt.verify(authHeader, process.env.ACCESS_TOKEN_SECRET, (err, analyst) => {
    if (err) return res.status(403).send(err);
    console.log(analyst);

    req.analyst = analyst;
    next();
  });
};
