// Convert user IDs to User JSON objects
const User = require("../models/User.js");

async function getUsers(userIds) {
    if (userIds.length === 0) {
        return [];
    }

    const promises = [];
    for (const userId of userIds) {
        const promise = User.findById(userId);
        promises.push(promise);
    }

    const users = await Promise.all(promises);

    // Get rid of null user objects (users who were not found in the database)
    return users.filter(user => user !== null);
}

module.exports = getUsers;