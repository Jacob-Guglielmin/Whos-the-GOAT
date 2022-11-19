"use strict";

const nameLeft = document.getElementById("nameLeft"),
    imageLeft = document.getElementById("imageLeft"),
    nameRight = document.getElementById("nameRight"),
    imageRight = document.getElementById("imageRight"),
    blurbLeft = document.getElementById("blurbLeft"),
    blurbRight = document.getElementById("blurbRight");

const keys = ["Adele", "Adolf Hitler", "Albert Einstein", "Barack Obama", "Beethoven", "Beyonce", "Cristiano Ronaldo", "Donald Trump", "Dream", "Ed Sheeran", "Elton John", "Elvis Presley", "Eminem", "Isaac Newton", "Jake Paul", "Johannes Gutenberg", "Justin Bieber", "Justin Trudeau", "KSI", "Kanye West", "Lebron James", "Leonardo da Vinci", "Logan Paul", "Madonna", "Mahatma Gandhi", "Michael Jackson", "Michael Jordan", "Michael Phelps", "Mozart", "MrBeast", "PewDiePie", "Rihanna", "Usain Bolt", "William Shakespeare"];

let currentMatchup = null;

// Consumes winner rating and loser rating, produces change to be applied
function elo(winner, loser) {
    // Determines kfactor for matchup (essentially volatility) based on average skill of players
    let kfactor;
    if ((winner + loser) / 2 < 1000) {
        kfactor = 40;
    } else if ((winner + loser) / 2 < 1500) {
        kfactor = 35;
    } else if ((winner + loser) / 2 < 2000) {
        kfactor = 30;
    } else if ((winner + loser) / 2 < 2500) {
        kfactor = 25;
    } else if ((winner + loser) / 2 < 3000) {
        kfactor = 20;
    } else if ((winner + loser) / 2 < 3500) {
        kfactor = 15;
    } else if ((winner + loser) / 2 < 4000) {
        kfactor = 10;
    } else {
        kfactor = 5;
    }

    // Calculates change (bigger difference = bigger change)
    // Change should then be added to winner and subtracted from loser
    let expected = 1 / (1 + Math.pow(10, (winner - loser) / 400));
    return kfactor * (1 - expected);
}

async function newMatchup() {
    currentMatchup = await getMatchup();
    displayMatchup();
}

async function getMatchup() {
    // Randomly selects two keys
    let key1 = keys[Math.floor(Math.random() * keys.length)];
    let key2 = keys[Math.floor(Math.random() * keys.length)];

    // Ensures that key1 and key2 are different
    while (key1 == key2) {
        key2 = keys[Math.floor(Math.random() * keys.length)];
    }

    // Get key information from database (TO DO)
    let person1 = await getPerson(key1);
    let person2 = await getPerson(key2);

    if (!person1.exists() || !person2.exists()) {
        return null;
    } else {
        return { left: { name: key1, data: person1.val() }, right: { name: key2, data: person2.val() } };
    }
}

function displayMatchup() {
    if (currentMatchup == null) {
        console.error("Failed to get people from database");

        nameLeft.innerText = "Error";
        nameRight.innerText = "Error";

        blurbLeft.innerText = "Failed to load people from database";
        blurbRight.innerText = "Failed to load people from database";

        imageLeft.style.display = "none";
        imageRight.style.display = "none";
    } else {
        nameLeft.innerText = currentMatchup.left.name + " " + currentMatchup.left.data.Date;
        nameRight.innerText = currentMatchup.right.name + " " + currentMatchup.right.data.Date;

        blurbLeft.innerText = currentMatchup.left.data.Blurb;
        blurbRight.innerText = currentMatchup.right.data.Blurb;

        imageLeft.src = currentMatchup.left.data.Image;
        imageRight.src = currentMatchup.right.data.Image;

        imageLeft.style.display = "block";
        imageRight.style.display = "block";
    }
}

function clickLeft() {
    //Don't do anything if the website is broken
    if (currentMatchup == null) {
        return;
    }

    let left = currentMatchup.left.data,
        right = currentMatchup.right.data;

    // Sets left side as winner, updates rating
    let change = elo(left.Elo, right.Elo);
    left.Elo += change;
    right.Elo -= change;

    left.Wins += 1;
    right.Losses += 1;

    // Update database
    updatePerson(currentMatchup.left.name, {
        Elo: left.Elo,
        Wins: left.Wins,
        Losses: left.Losses
    });
    updatePerson(currentMatchup.right.name, {
        Elo: right.Elo,
        Wins: right.Wins,
        Losses: right.Losses
    });

    // Display new matchup
    newMatchup();
}

function clickRight() {
    //Don't do anything if the website is broken
    if (currentMatchup == null) {
        return;
    }

    let left = currentMatchup.left.data,
        right = currentMatchup.right.data;

    // Sets right side as winner, updates rating
    let change = elo(right.Elo, left.Elo);
    right.Elo += change;
    left.Elo -= change;

    right.Wins += 1;
    left.Losses += 1;

    // Update database
    updatePerson(currentMatchup.left.name, {
        Elo: left.Elo,
        Wins: left.Wins,
        Losses: left.Losses
    });
    updatePerson(currentMatchup.right.name, {
        Elo: right.Elo,
        Wins: right.Wins,
        Losses: right.Losses
    });

    // Display new matchup
    newMatchup();
}

document.getElementById("choiceLeft").addEventListener("click", clickLeft);
document.getElementById("choiceRight").addEventListener("click", clickRight);

newMatchup();
