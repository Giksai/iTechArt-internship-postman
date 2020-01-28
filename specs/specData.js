const errors = {
    auth_wrongData: `That email/username and password combination didn't work. Try again.`,
    auth_timeout: `You have exceeded the allowed rate limit. Please retry after a few seconds.`,
};

module.exports = {
    errors: errors,
};