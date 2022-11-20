"use strict";

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBcckCL6xuOCbYsbzLp2BGxXNVPCkz4pEI",
    authDomain: "whos-the-goat.firebaseapp.com",
    databaseURL: "https://whos-the-goat-default-rtdb.firebaseio.com",
    projectId: "whos-the-goat",
    storageBucket: "whos-the-goat.appspot.com",
    messagingSenderId: "737156967828",
    appId: "1:737156967828:web:c3ba400a40f78674ff3381"
};

initializeApp(firebaseConfig);

const db = getDatabase();

function getPerson(person) {
    const personRef = getPersonRef(person);
    return get(personRef);
}

function updatePerson(person, newContent) {
    const personRef = getPersonRef(person);
    return update(personRef, newContent);
}

function getPersonRef(person) {
    return ref(db, "people/" + person);
}

window.getPerson = getPerson;
window.updatePerson = updatePerson;
