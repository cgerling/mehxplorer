'use strict';

function add(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function get(key) {
    return JSON.parse(localStorage.getItem(key));
}

function remove(key) {
    localStorage.removeItem(key);
}

const storageService = {
    add,
    get,
    remove
}