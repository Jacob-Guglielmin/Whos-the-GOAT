"use strict";

const nameLeft = document.getElementById("nameLeft"),
    imageLeft = document.getElementById("imageLeft"),
    nameRight = document.getElementById("nameRight"),
    imageRight = document.getElementById("imageRight"),
    blurbLeft = document.getElementById("blurbLeft"),
    blurbRight = document.getElementById("blurbRight");

const keys = ["Abraham Lincoln", "Ada Lovelace", "Adam Smith", "Adele", "Adin Ross", "Adolf Hitler", "Albert Einstein", "Alexander the Great", "Ali-A", "Amelia Earhart", "Andrew Tate", "Archimedes", "Ariana Grande", "Aristotle", "Arnold Schwarzenegger", "Augustus", "Barack Obama", "Beethoven", "Beyonce", "Bill Gates", "Brad Pitt", "Bruno Mars", "Brutus", "Buzz Aldrin", "Calvin Harris", "CaptainSparklez", "Charles Darwin", "Charli DAmelio", "Chester Bennington", "Chris Bumstead", "Chris Hadfield", "Chris Pratt", "Chris Rock", "Christopher Columbus", "Confucius", "Conor McGregor", "Cristiano Ronaldo", "DaBaby", "DanTDM", "Daniel Radcliffe", "Doja Cat", "Donald Trump", "Dr Seuss", "Drake", "Dream", "Dua Lipa", "Dwayne Johnson", "Ed Sheeran", "Elon Musk", "Elton John", "Elvis Presley", "Eminem", "Emma Watson", "Faker", "Fidel Castro", "Floyd Mayweather", "Frank Ocean", "Frank Sinatra", "Franklin D~ Roosevelt", "Freddie Mercury", "Friedrich Nietzsche", "Genghis Khan", "George Orwell", "George Washington", "GeorgeNotFound", "Hannibal", "Hans Niemann", "Harry Styles", "Hikaru Nakamura", "Hillary Clinton", "Hirohito", "IShowSpeed", "Isaac Newton", "J~ Cole", "J~K~ Rowling", "J~R~R~ Tolkien", "Jack Black", "Jacksepticeye", "Jake Paul", "Jeff Bezos", "Jeffery Dahmer", "Jeffrey Epstein", "Jennette McCurdy", "Jesus Christ", "Joe Biden", "Johann Sebastian Bach", "Johannes Gutenberg", "John A~ Macdonald", "John F~ Kennedy", "John Lennon", "John Locke", "John Maynard Keynes", "Joji", "Joseph Stalin", "Juice WRLD", "Julius Caesar", "Justin Bieber", "Justin Trudeau", "KSI", "Kai Cenat", "Kamala Harris", "Kanye West", "Katy Perry", "Kendrick Lamar", "Kevin Hart", "Kim Jong-un", "Kim Kardashian", "King Henry VIII", "Kylie Jenner", "Lebron James", "Leo Tolstoy", "Leonardo da Vinci", "Leonhard Euler", "Lil Uzi Vert", "Lionel Messi", "Logan Paul", "Machiavelli", "Madonna", "Magnus Carlsen", "Mahatma Gandhi", "Malala Yousafzai", "Mao Zedong", "Marie Curie", "Markiplier", "Markus 'Notch' Persson", "Michael Jackson", "Michael Jordan", "Michael Phelps", "Michelangelo", "Mike Tyson", "Miranda Cosgrove", "Mozart", "MrBeast", "Muhammad", "Napoleon Bonaparte", "Neil Armstrong", "Neil Diamond", "Nelson Mandela", "Nick Eh 30", "Nicki Minaj", "Ninja", "Novak Djokovic", "Olivia Rodrigo", "Oprah Winfrey", "Osama bin Laden", "PROD", "Pablo Escobar", "Pablo Picasso", "Paul McCartney", "PewDiePie", "Plato", "Pompey", "Pope Francis", "Post Malone", "Queen Elizabeth II", "Queen Victoria", "Rafael Nadal", "Rick Astley", "Rihanna", "Roald Dahl", "Roger Federer", "Ronnie Coleman", "Rosa Parks", "Ryan Reynolds", "Saddam Hussein", "Saint Teresa of Calcutta (Mother Teresa)", "Sal Khan", "Sapnap", "Selena Gomez", "Shaquille ONeal", "Shigeru Miyamoto", "Sid Meier", "Sidney Crosby", "Sigmund Freud", "Simon Cowell", "Sinatraa", "Socrates", "Stampy", "Stephen Curry", "Stephen King", "Steve Jobs", "Sun Tzu", "Taylor Swift", "Technoblade", "Ted Bundy", "The Buddha", "The Weeknd", "Theodore 'Teddy' Roosevelt", "Thomas Hobbes", "Tiger Woods", "Tim Cook", "Tom Cruise", "Tom Holland", "Tom Scott", "Travis Scott", "Usain Bolt", "Vincent Van Gogh", "Vladimir Lenin", "Vladimir Putin", "Walt Disney", "Wayne Gretzky", "'Weird Al' Yankovic", "Will Smith", "William Shakespeare", "Winston Churchill", "XXXTentacion", "Yeat", "YoungBoy Never Broke Again", "Zendaya", "videogamedunkey", "xQc"];

let currentMatchup = null;

// Consumes string of up to 10 Ws and Ls, appends outcome
function updateRecent(past, outcome) {
    if (past == "") {
        return outcome;
    } else if (past.length >= 10) {
        return past.substring(1) + outcome;
    } else {
        return past + outcome;
    }
}

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
    let expected = 1 / (1 + Math.pow(10, (loser - winner) / 400));
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
        nameLeft.innerText = currentMatchup.left.name.replace(/~/g, ".") + " " + currentMatchup.left.data.Date;
        nameRight.innerText = currentMatchup.right.name.replace(/~/g, ".") + " " + currentMatchup.right.data.Date;

        blurbLeft.innerText = currentMatchup.left.data.Blurb;
        blurbRight.innerText = currentMatchup.right.data.Blurb;

        imageLeft.src = currentMatchup.left.data.Image;
        imageRight.src = currentMatchup.right.data.Image;

        imageLeft.style.display = "block";
        imageRight.style.display = "block";
    }
}

function floatGoat(e, num) {
    // make num amount of floatGoats
    for (let i = 0; i < num; i++) {
        // let goat = goat.png
        let goat = document.createElement("img");
        goat.src = Math.random() < 0.5 ? "assets/goat.png" : "assets/goat2.png";

        // randomize dimensions of goat
        let goatSize = Math.floor(Math.random() * 60) + 10;
        goat.style.width = goatSize + "px";
        goat.style.height = goatSize + "px";

        // set goat position to position of cursor
        goat.style.position = "absolute";
        let startX = e.clientX;
        let startY = e.clientY;
        let randomFactorX = Math.floor(Math.random() * 50) - 25;
        let randomFactorY = Math.floor(Math.random() * 50) - 25;
        goat.style.left = startX - goatSize / 2 + randomFactorX + "px";
        goat.style.top = startY + randomFactorY + "px";

        // randomize rotation of goat
        let goatRotation = Math.floor(Math.random() * 60) - 30;
        goat.style.transform = "rotate(" + goatRotation + "deg)";

        // append goat to body and set opacity
        goat.style.opacity = "1";
        goat.style.transition = "opacity 1s";
        goat.style.zIndex = "100";
        document.body.appendChild(goat);

        // FLOAT GOAT
        setInterval(() => {
            goat.style.top = parseFloat(goat.style.top) - 1.3 + "px";
            if (randomFactorX <= -17) {
                goat.style.left = parseFloat(goat.style.left) - 0.3 + "px";
            } else if (randomFactorX <= -8 && randomFactorX > -17) {
                goat.style.left = parseFloat(goat.style.left) - 0.15 + "px";
            } else if (randomFactorX < 0 && randomFactorX > -8) {
                goat.style.left = parseFloat(goat.style.left) - 0.05 + "px";
            } else if (randomFactorX >= 0 && randomFactorX < 8) {
                goat.style.left = parseFloat(goat.style.left) + 0.05 + "px";
            } else if (randomFactorX >= 8 && randomFactorX < 17) {
                goat.style.left = parseFloat(goat.style.left) + 0.15 + "px";
            } else if (randomFactorX >= 17) {
                goat.style.left = parseFloat(goat.style.left) + 0.3 + "px";
            }
        }, 10);

        // BLOAT GOAT
        setInterval(() => {
            goat.style.width = parseFloat(goat.style.width) + 0.3 + "px";
            goat.style.height = parseFloat(goat.style.height) + 0.3 + "px";
        }, 10);

        // delete goat after 2 seconds
        setTimeout(() => {
            goat.style.opacity = "0";
            setTimeout(() => {
                goat.remove();
            }, 1000);
        }, 100);
    }

    // load goat.mp3 and play it
    let track = Math.random() < 0.01 ? 0 : randomBetween(1, 9);
    let goatSound = new Audio("assets/bleat" + track + ".mp3");
    goatSound.play();
}

function secretEvent() {
    let goat = document.createElement("img");
    goat.src = "assets/goat2.png";
    goat.classList.add("walkingGoat");
    goat.style.left = Math.floor(-window.innerHeight * 0.05) + "px";
    goat.style.top = Math.floor(window.innerHeight * 0.05) + "px";
    goat.walkStep = 0;
    topBar.appendChild(goat);

    const baselineTop = Math.floor(window.innerHeight * 0.05),
        distUp = Math.floor(window.innerHeight * 0.008),
        distRight = Math.floor(window.innerHeight * 0.03),
        stopTime = 12,
        speedRight = 1.5;
    let stopping = { accumulated: randomBetween(0, distRight), stoppedTime: 0 };

    let goatWalk = setInterval(() => {
        if (stopping.accumulated > distRight) {
            stopping.accumulated = 0;
            stopping.stoppedTime = stopTime;
            goat.style.top = baselineTop + "px";
        } else if (stopping.stoppedTime != 0) {
            stopping.stoppedTime--;
        } else {
            stopping.accumulated += speedRight;
            goat.style.left = parseFloat(goat.style.left) + speedRight + "px";
            goat.style.top = baselineTop - distUp * Math.sin((Math.PI * stopping.accumulated) / distRight) + "px";
        }

        if (parseInt(goat.style.left) > window.innerWidth) {
            console.log("GOAT HAS LEFT THE BUILDING");
            clearInterval(goatWalk);
            goat.remove();
        }
    }, 20);
}

setInterval(() => {
    let random = Math.floor(Math.random() * 100);
    if (random < 50 && document.hasFocus()) {
        secretEvent();
    }
}, 60000);

function clickLeft(e) {
    // Don't do anything if the website is broken
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

    left.Recent = updateRecent(left.Recent, "W");
    right.Recent = updateRecent(right.Recent, "L");

    // Update database
    updatePerson(currentMatchup.left.name, {
        Elo: left.Elo,
        Wins: left.Wins,
        Losses: left.Losses,
        Recent: left.Recent
    });
    updatePerson(currentMatchup.right.name, {
        Elo: right.Elo,
        Wins: right.Wins,
        Losses: right.Losses,
        Recent: right.Recent
    });

    floatGoat(e, randomBetween(4, 9));

    // Display new matchup
    newMatchup();
}

function clickRight(e) {
    // Don't do anything if the website is broken
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

    right.Recent = updateRecent(right.Recent, "W");
    left.Recent = updateRecent(left.Recent, "L");

    // Update database
    updatePerson(currentMatchup.left.name, {
        Elo: left.Elo,
        Wins: left.Wins,
        Losses: left.Losses,
        Recent: left.Recent
    });
    updatePerson(currentMatchup.right.name, {
        Elo: right.Elo,
        Wins: right.Wins,
        Losses: right.Losses,
        Recent: right.Recent
    });

    floatGoat(e, randomBetween(4, 9));

    // Display new matchup
    newMatchup();
}

//Generate a random number between min and max (inclusive)
function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Event listeners and functions to run on page load
document.getElementById("choiceLeft").addEventListener("click", clickLeft);
document.getElementById("choiceRight").addEventListener("click", clickRight);
newMatchup();
