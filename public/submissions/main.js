"use strict";

const nameInput = document.getElementById("nameInput"),
    dateInput = document.getElementById("dateInput"),
    blurbInput = document.getElementById("blurbInput"),
    imageURLInput = document.getElementById("imageURLInput"),
    submitButton = document.getElementById("submitButton"),
    submissionInfo = document.getElementById("submissionInfo"),
    nameDisplay = document.getElementById("nameDisplay"),
    blurbDisplay = document.getElementById("blurbDisplay"),
    imageDisplay = document.getElementById("imageDisplay");

let personName = "",
    date = "",
    blurb = "",
    imageURL = "";

let mostRecentImage = 0,
    mostRecentImageChecked = 0,
    mostRecentImageValidated = 0,
    mostRecentValidImageURL = "";

function submit() {
    if (validateInput()) {
        let submission = {};
        submission[personName.replace(/\./g, "~")] = {
            Blurb: blurb,
            Date: date,
            Image: mostRecentValidImageURL,
            Losses: 0,
            Recent: "",
            Wins: 0
        };

        createSubmission(submission)
            .then(() => {
                nameInput.value = "";
                dateInput.value = "";
                blurbInput.value = "";
                imageURLInput.value = "";
                update();

                submissionInfo.style.color = "#ffffff";

                submissionInfo.textContent = "Submission successful";

                //This is a hack to force the browser to re-render the element with opacity 1 instantly
                submissionInfo.style.transition = "none";
                submissionInfo.style.opacity = 1;
                submissionInfo.offsetHeight;
                submissionInfo.style.transition = "";

                //Hide the element again
                setTimeout(() => {
                    submissionInfo.style.opacity = 0;
                }, 3000);
            })
            .catch((error) => {
                console.error(error);

                submissionInfo.style.color = "#ff0000";

                submissionInfo.textContent = "Submission failed";

                //This is a hack to force the browser to re-render the element with opacity 1 instantly
                submissionInfo.style.transition = "none";
                submissionInfo.style.opacity = 1;
                submissionInfo.offsetHeight;
                submissionInfo.style.transition = "";

                //Hide the element again
                setTimeout(() => {
                    submissionInfo.style.opacity = 0;
                }, 3000);
            });
    }
}

function update() {
    updateFields();
    updateDisplay();
}

function updateDisplay() {
    nameDisplay.textContent = personName + " " + date;
    blurbDisplay.textContent = blurb;

    if (mostRecentValidImageURL != "") {
        imageDisplay.src = mostRecentValidImageURL;
        imageDisplay.style.display = "block";
    } else {
        imageDisplay.style.display = "none";
    }

    nameInput.style.borderColor = nameValid() ? "#ffffff" : "#ff0000";
    dateInput.style.borderColor = dateValid() ? "#ffffff" : "#ff0000";
    blurbInput.style.borderColor = blurbValid() ? "#ffffff" : "#ff0000";
}

function updateFields() {
    personName = nameInput.value;
    date = dateInput.value;
    blurb = blurbInput.value;

    if (imageURLInput.value !== imageURL) {
        imageURL = imageURLInput.value;

        imageURLInput.style.borderColor = "#ffff00";
        submitButton.disabled = true;
    }

    validateImageLink();
}

function validateInput() {
    return nameValid() && dateValid() && blurbValid() && imageURLValid();
}

function nameValid() {
    return personName !== "" && personName.match(/^[a-zA-Z0-9 \.\-\(\)']+$/) != null;
}

function dateValid() {
    return date !== "" && date.match(/^\((born |\d{1,4}( BC)?-)\d{1,4}(( BC)|( AD))?\)$/) != null;
}

function blurbValid() {
    return blurb !== "" && blurb.length <= 250 && blurb.match(/^[\x00-\x7F]+$/) != null;
}

function imageURLValid() {
    return imageURL !== "" && imageURL.length <= 500 && mostRecentImageValidated === mostRecentImage;
}

function validateImageLink() {
    if (imageURL === "" || imageURL.substring(imageURL.length - 3) == "gif") {
        mostRecentImageChecked = ++mostRecentImage;
        mostRecentImageChecked = mostRecentImage;
        mostRecentValidImageURL = "";
        imageURLInput.style.borderColor = "#ff0000";
        submitButton.disabled = true;
    } else {
        let thisImageId = ++mostRecentImage;
        let thisImageURL = imageURL;
        let img = new Image();
        img.onload = function () {
            if (thisImageId > mostRecentImageChecked) {
                mostRecentImageChecked = thisImageId;
                mostRecentValidImageURL = thisImageURL;
                mostRecentImageValidated = thisImageId;
                submitButton.disabled = !validateInput();
                imageURLInput.style.borderColor = "#ffffff";
                updateDisplay();
            }
        };
        img.onerror = function () {
            if (thisImageId > mostRecentImageChecked) {
                mostRecentImageChecked = thisImageId;
                mostRecentValidImageURL = "";
                submitButton.disabled = true;
                imageURLInput.style.borderColor = "#ff0000";
                updateDisplay();
            }
        };
        img.src = thisImageURL;
        updateDisplay();
    }
}

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
    if (random < 20 && document.hasFocus()) {
        secretEvent();
    }
}, 60000);

//Generate a random number between min and max (inclusive)
function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

nameInput.addEventListener("input", update);
dateInput.addEventListener("input", update);
blurbInput.addEventListener("input", update);
imageURLInput.addEventListener("input", update);

submitButton.onclick = submit;

update();
