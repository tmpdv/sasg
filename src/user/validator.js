function validateUser(user) {
    const result = {
        isValid: () => {
            return this.errors.length === 0
        },
        errors: []
    };
    if (!user.login) {
        result.errors.add({field: "login", message: "Must be filled"});
    }
    return result;
}

module.exports = {
    validateUser: validateUser
}