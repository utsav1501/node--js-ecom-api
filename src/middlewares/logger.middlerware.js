// Import the necessary modules here
import fs from 'fs';

// Write your code here
const fsPromise = fs.promises;

async function log(logData) {
  try {
    logData = new Date().toString() + '\n' + logData + '\n';
    await fsPromise.appendFile('log.txt', logData);
  } catch (err) {
    console.log(err);
  }
}

export const loggerMiddleware = async (req, res, next) => {
  // Write your code here
  const logData = `URL: ${req.url}\nBody: ${JSON.stringify(req.body, null, 2)}`;
  await log(logData);
  next();
};

export default loggerMiddleware;
