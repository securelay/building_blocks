const rateLimitMax = 120;
const rateLimitTimeWindow = '1 minute'; // or in milliseconds if no unit specified
const rateLimitBan = 4; // 403s after this number of 429s
const bodyLimit = 10000; // 10KB
const port = 8000;

export { rateLimitMax, rateLimitTimeWindow, rateLimitBan, bodyLimit, port };
