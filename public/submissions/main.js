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
        submission[personName] = {
            Blurb: blurb,
            Date: date,
            Elo: 1000,
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
}

function updateFields() {
    personName = nameInput.value;
    date = dateInput.value;
    blurb = blurbInput.value;
    imageURL = imageURLInput.value;

    validateImageLink();
}

function validateInput() {
    return personName !== "" && date !== "" && blurb !== "" && imageURL !== "" && blurb.length <= 250 && imageURL.length <= 500 && mostRecentImageValidated === mostRecentImage && personName.match(/^[a-zA-Z0-9 \.\-\(\)]+$/) != null && date.match(/^\((born |\d{1,4}( BC)?-)\d{1,4}(( BC)|( AD))?\)$/) != null && blurb.match(/^[\x00-\x7F]+$/) != null;
}

function validateImageLink() {
    if (imageURL === "") {
        mostRecentImageChecked = ++mostRecentImage;
        mostRecentImageChecked = mostRecentImage;
        mostRecentValidImageURL = "";
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
                updateDisplay();
            }
        };
        img.onerror = function () {
            if (thisImageId > mostRecentImageChecked) {
                mostRecentImageChecked = thisImageId;
                mostRecentValidImageURL = "";
                submitButton.disabled = true;
                updateDisplay();
            }
        };
        img.src = thisImageURL;
    }
}

nameInput.addEventListener("input", update);
dateInput.addEventListener("input", update);
blurbInput.addEventListener("input", update);
imageURLInput.addEventListener("input", update);

submitButton.onclick = submit;

update();
