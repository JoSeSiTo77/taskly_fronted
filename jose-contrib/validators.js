import zxcvbn from 'zxcvbn' 

/*
    Validate simple email with regular expresion
*/


class EmailValidationError extends Error {
    constructor(message){
        super(message);
        this.name = 'InvalidEmail'
    }
}

export function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!regex.test(email)){
        throw new EmailValidationError('The email field is invalid')
    }
}

/* 
    Validate password with a specific number of digits (max or min), compare with form fields, include or do not include at least one capital letter and include or do not include special characters
*/


class PasswordValidationError extends Error {
    constructor(message) {
        super(message)
        this.name = 'PasswordValidationError'
    }
}

export function validatePassword(
    password,
    minDigitsLimit,
    {
        mayus = false,
        specialChars = false
    } = {},
    ...formFields
) {
    const regexCapitalLetter = /[A-Z]/
    const regexSpecialChars = /[!@#$%^&*(),.?":{}|<>]/

    if (password === undefined || minDigitsLimit === undefined) {
        throw new PasswordValidationError('password and minDigitsLimit are required')
    }

    if (password.length < minDigitsLimit) {
        throw new PasswordValidationError(`Password must be at least ${minDigitsLimit} characters`)
    }

    if (mayus && !regexCapitalLetter.test(password)) {
        throw new PasswordValidationError('Password must contain at least 1 capital letter')
    }

    if (specialChars && !regexSpecialChars.test(password)) {
        throw new PasswordValidationError('Password must contain at least 1 special character')
    }

    const result = zxcvbn(password, formFields)

    if (result.score < 3) {
        throw new PasswordValidationError('Password is too weak')
    }

    return true
}