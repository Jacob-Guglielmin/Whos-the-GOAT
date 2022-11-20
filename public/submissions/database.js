"use strict";

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js";

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

const db = getDatabase(),
    submissionsRef = ref(db, "submissions");

function createSubmission(submission) {
    return push(submissionsRef, submission);
}

window.createSubmission = createSubmission;
