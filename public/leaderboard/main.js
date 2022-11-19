const leaderboardEntryTemplate = document.getElementById("leaderboardEntryTemplate"),
    mainContainer = document.getElementById("mainContainer"),
    midBar = document.getElementById("midBar"),
    bottomBar = document.getElementById("bottomBar");

let currentlyDisplayed = 0;

let sortedPeople = [];
let people = {};

function createLeaderboardEntry(name, data, rank) {
    let entry = leaderboardEntryTemplate.content.cloneNode(true);
    entry.querySelector(".rank").innerText = rank;
    entry.querySelector(".leaderboardName").innerText = name;
    entry.querySelector(".leaderboardDate").innerText = data.Date;
    entry.querySelector(".leaderboardElo").innerText = Math.round(data.Elo);
    entry.querySelector(".leaderboardWinrate").innerText = ((data.Wins / (data.Wins + data.Losses || 1)) * 100).toFixed(2) + "%";
    entry.querySelector(".leaderboardImage").src = data.Image;
    /* let recentWins = data.Recent.split("")
        .map((x) => parseInt(x))
        .reduce((a, b) => a + b, 0);
    entry.querySelector(".recentIndicator").classList.add(recentWins > 5 ? "upArrow" : recentWins < 5 ? "downArrow" : "noChange"); */
    return entry;
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
        mainContainer.appendChild(createLeaderboardEntry(name, data, "#" + (currentlyDisplayed + 1)));
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
