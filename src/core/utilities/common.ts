import { storages } from '@handlers/state';

const { preferences } = storages;

const name = {
    defaults: {
        firstName: '',
        lastName: ':3'
    },

    get firstName() {
        return preferences.get('shouldUseCuteName')
            ? preferences.get('cuterFirstName') || this.defaults.firstName
            : preferences.get('firstName');
    },

    get lastName() {
        return preferences.get('shouldUseCuteName')
            ? preferences.get('cuterLastName') || this.defaults.lastName
            : preferences.get('lastName');
    }
};

const repository = {
    user: 'https://github.com/NajmAjmal',

    get plain() {
        return this.user + '/azalea';
    },

    raw: 'https://raw.githubusercontent.com/NajmAjmal/Azalea-maths',
};

const getImage = (name: string) => `${repository.raw}/sparx-v2/extension/assets/${name}`;
const capitalize = (s: string) => s.trim().replace(/^\w/, m => m.toUpperCase());
const noop = () => { };

export default {
    name,
    repository,
    getImage,
    capitalize,
    noop
};

export {
    name,
    repository,
    getImage,
    capitalize,
    noop
};