import {HttpStatus, ValidationPipe} from "@nestjs/common";

const PASSWORD_RULE = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/

const PASSWORD_RULE_MESSAGE = 'Password should have 1 upper case, lowcase'

const VALIDATION_PIPE = new ValidationPipe({
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
})


export const REGEX = {
    PASSWORD_RULE,
}

export const MESSAGE = {
    PASSWORD_RULE_MESSAGE
};

export const SETTINGS = {
    VALIDATION_PIPE
};

export const geoBackup = [
    {
        latitude: 48.8698679,
        longitude: 2.3072976,
        country: 'France',
        countryCode: 'FR',
        city: 'Paris',
        zipcode: '75008',
        streetName: 'Champs-Élysées',
        streetNumber: '29',
        administrativeLevels: {
            level1long: 'Île-de-France',
            level1short: 'IDF',
            level2long: 'Paris',
            level2short: '75'
        },
        provider: 'google'
    }
];