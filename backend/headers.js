const config = require("./config.js");

const headers = new Headers();
headers.append("Client-ID", config.clientID);
headers.append("Authorization", config.authorization);

module.exports = headers;