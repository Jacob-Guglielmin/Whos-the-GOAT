const leaderboardEntryTemplate = document.getElementById("leaderboardEntryTemplate"),
    mainContainer = document.getElementById("mainContainer"),
    midBar = document.getElementById("midBar"),
    bottomBar = document.getElementById("bottomBar");

let currentlyDisplayed = 0;

let sortedPeople = [];
let people = {};

function createLeaderboardEntry(name, data, rank) {
    let entry = leaderboardEntryTemplate.content.cloneNode(true);
    let rankImage;
    if (rank <= 3) {
        rankImage = document.createElement("img");
        if (rank == 1) {
            rankImage.src = "../assets/goat.png";
            entry.querySelector(".rank").classList.add("shakeOnHover");
        } else if (rank == 2) {
            rankImage.src = "assets/silverMedal.png";
        } else if (rank == 3) {
            rankImage.src = "assets/bronzeMedal.png";
        }
        entry.querySelector(".rank").appendChild(rankImage);
    } else {
        entry.querySelector(".rank").innerText = "#" + rank;
    }
    entry.querySelector(".leaderboardName").innerText = name.replace(/~/g, ".");
    entry.querySelector(".leaderboardDate").innerText = data.Date;
    entry.querySelector(".leaderboardBlurb").innerText = data.Blurb;
    entry.querySelector(".leaderboardElo").innerText = Math.round(data.Elo);
    entry.querySelector(".leaderboardWinrate").innerText = ((data.Wins / (data.Wins + data.Losses || 1)) * 100).toFixed(2) + "%";
    entry.querySelector(".leaderboardImage").src = data.Image;
    let recentWins = data.Recent.split("")
        .map((x) => (x == "W" ? 1 : 0))
        .reduce((a, b) => a + b, 0);
    entry.querySelector(".recentIndicator").classList.add(recentWins > data.Recent.toString().length / 2 ? "upArrow" : recentWins < data.Recent.toString().length / 2 ? "downArrow" : "noChange");

    entry.querySelector(".leaderboardEntry").addEventListener("mouseenter", slideUp.bind(entry.querySelector(".leaderboardPersonInfo")));
    entry.querySelector(".leaderboardEntry").addEventListener("mouseleave", slideDown.bind(entry.querySelector(".leaderboardPersonInfo")));

    return entry;
}

function slideUp() {
    if (window.innerWidth > 700) {
        this.querySelector(".leaderboardNameDateContainer").style.transform = "translateY(-20vh)";
        this.querySelector(".leaderboardBlurb").style.transform = "translateY(-20vh)";
        if (this.parentElement.previousElementSibling.classList.contains("shakeOnHover")) {
            this.parentElement.previousElementSibling.classList.add("shaking");
        }
    }
}

function slideDown() {
    this.querySelector(".leaderboardNameDateContainer").style.transform = "translateY(0vh)";
    this.querySelector(".leaderboardBlurb").style.transform = "translateY(0vh)";
    if (this.parentElement.previousElementSibling.classList.contains("shakeOnHover")) {
        this.parentElement.previousElementSibling.classList.remove("shaking");
    }
}

function displayMore() {
    for (let i = 0; i < 10; i++) {
        if (currentlyDisplayed == 0) {
            mainContainer.innerHTML = "";
        }
        if (currentlyDisplayed >= sortedPeople.length) {
            bottomBar.style.display = "none";
            break;
        }
        let name = sortedPeople[currentlyDisplayed];
        let data = people[name];
        mainContainer.appendChild(createLeaderboardEntry(name, data, currentlyDisplayed + 1));
        currentlyDisplayed++;
    }
}

async function getSortedPeople() {
    let peopleSnapshot = await getPeople();
    if (peopleSnapshot.exists()) {
        people = peopleSnapshot.val();
        sortedPeople = Object.keys(people);
        sortedPeople.sort((a, b) => people[b].Elo - people[a].Elo);
    } else {
        throw new Error("Failed to get people from database");
    }
}

getSortedPeople()
    .then(() => {
        displayMore();
        bottomBar.style.display = "flex";
    })
    .catch((err) => {
        console.error(err);
        let errorElement = document.createElement("h1");
        errorElement.innerText = "Failed to load people from database";
        mainContainer.innerHTML = "";
        mainContainer.appendChild(errorElement);
        midBar.style.display = "none";
    });

function secretEvent() {
    let goat = document.createElement("img");
    goat.src = "../assets/goat2.png";
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

//Generate a random number between min and max (inclusive)
function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
