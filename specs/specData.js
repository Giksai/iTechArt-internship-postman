const errors = {
    auth_wrongData: `That email/username and password combination didn't work. Try again.`,
    auth_timeout: `You have exceeded the allowed rate limit. Please retry after a few seconds.`,
    register_userAlreadyExists: `An account with this username already exists.`,
    register_emailAlreadyTaken: `An account with this email already exists.`,
};

module.exports = {
    errors: errors,
};