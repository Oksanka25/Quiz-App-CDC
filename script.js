//References
let timeLeft = document.querySelector(".time-left");
let quizContainer = document.getElementById("container");
let nextBtn = document.getElementById("next-button");
let countOfQuestion = document.querySelector(".number-of-question");
let displayContainer = document.getElementById("display-container");
let scoreContainer = document.querySelector(".score-container");
let restartBtn = document.getElementById("restart");
let homeBtns = document.querySelectorAll(".home");
let userScore = document.getElementById("user-score");
let startScreen = document.getElementById("start-screen");
let questionCount;
let scoreCount = 0;
let timerSeconds = 46;
let countdown;

let currentVolumeName;

//To add new volumes
const volumes = [
    { label: "Start Volume 1", filePath: "volume1" },
    { label: "Start Volume 2", filePath: "volume2" },
    { label: "Start Volume 3", filePath: "volume3" },
    { label: "Start Volumes 1-3", filePath: "volume1-3" },
    { label: "Start Volume 4", filePath: "volume3" },
    { label: "Start Volume 5", filePath: "volume3" },
    { label: "Start Volume 6", filePath: "volume3" },
    { label: "Start Volume 7", filePath: "volume3" },
    { label: "Start Volume 8", filePath: "volume3" },
    { label: "Start Test Volume ", filePath: "test-volume" },
];

//Questions and Options array
function loadVolume(name) {
    let xhr = new XMLHttpRequest();

    xhr.open("GET", `${name}.json`, false);

    xhr.send();

    xhr.onload = function () {
        if (this.status == 200) {
            //console.log(this.response)
        } else {
            console.log("Oops something went wrong");
        }
    };

    return xhr.response;
}

let quizArray = [];

//Restart Quiz
restartBtn.addEventListener("click", () => {
    initial(currentVolumeName);
    displayContainer.style.display = "block";
    scoreContainer.classList.add("hide");
});

homeBtns.forEach((button) =>
    button.addEventListener("click", () => {
        displayContainer.style.display = "none";
        startScreen.style.display = "grid";
        scoreContainer.classList.add("hide");
    })
);

//Next Button
nextBtn.addEventListener(
    "click",
    (displayNext = () => {
        //increment questionCount
        questionCount += 1;
        //if last question
        if (questionCount == quizArray.length) {
            //hide question container and display score
            displayContainer.style.display = "none";
            scoreContainer.classList.remove("hide");
            //user score
            userScore.innerHTML = `Your score is ${scoreCount} out of ${questionCount} <br> <strong>${(scoreCount / questionCount).toFixed(1) * 100
                }%</strong>`;
        } else {
            //display questionCount
            countOfQuestion.innerHTML =
                questionCount + 1 + " of " + quizArray.length + " Question";
            //display quiz
            quizDisplay(questionCount);
            timerSeconds = 46;
            clearInterval(countdown);
            timerDisplay();
        }
    })
);

//Timer
const timerDisplay = () => {
    countdown = setInterval(() => {
        timerSeconds--;
        timeLeft.innerHTML = `${timerSeconds}s`;
        if (timerSeconds == 0) {
            clearInterval(countdown);
            displayNext();
        }
    }, 1000);
};

//Display quiz
const quizDisplay = (questionCount) => {
    let quizCards = document.querySelectorAll(".container-mid");
    //Hide other cards
    quizCards.forEach((card) => {
        card.classList.add("hide");
    });
    //display current question card
    quizCards[questionCount].classList.remove("hide");
};

//Quiz Creation
function quizCreator(volumeName) {
    //randomly sort questions
    quizArray = JSON.parse(loadVolume(volumeName));

    quizArray.sort(() => Math.random() - 0.5);
    //generate quiz
    for (let i of quizArray) {
        //randomly sort options
        i.options.sort(() => Math.random() - 0.5);
        //quiz card creation
        let div = document.createElement("div");
        div.classList.add("container-mid", "hide");
        //question number
        countOfQuestion.innerHTML = 1 + " of " + quizArray.length + " Question";
        //question
        let question_DIV = document.createElement("p");
        question_DIV.classList.add("question");
        question_DIV.innerHTML = i.question;
        div.appendChild(question_DIV);
        //options
        div.innerHTML += `
    <button class="option-div" onclick="checker(this)">${i.options[0]}</button>
     <button class="option-div" onclick="checker(this)">${i.options[1]}</button>
      <button class="option-div" onclick="checker(this)">${i.options[2]}</button>
       <button class="option-div" onclick="checker(this)">${i.options[3]}</button>
    `;
        quizContainer.appendChild(div);
    }
}

//Checker Function to check if option is correct or not
function checker(userOption) {
    let userSolution = userOption.innerText;
    let question =
        document.getElementsByClassName("container-mid")[questionCount];
    let options = question.querySelectorAll(".option-div");

    //if user clicked answer == correct option stored in object
    if (userSolution === quizArray[questionCount].correct) {
        userOption.classList.add("correct");
        scoreCount++;
    } else {
        userOption.classList.add("incorrect");
        //For marking the correct option
        options.forEach((element) => {
            if (element.innerText == quizArray[questionCount].correct) {
                element.classList.add("correct");
            }
        });
    }

    //clear interval(stop timer)
    clearInterval(countdown);
    //disable all options
    options.forEach((element) => {
        element.disabled = true;
    });
}

//initial setup
function initial(volumeName) {
    currentVolumeName = volumeName;
    startScreen.style.display = "none";
    displayContainer.style.display = "block";
    quizContainer.innerHTML = "";
    questionCount = 0;
    scoreCount = 0;
    timerSeconds = 46;

    clearInterval(countdown);
    timerDisplay();
    quizCreator(volumeName);
    quizDisplay(questionCount);
}

function createVolumeButton(label) {
    let button = document.createElement("button");
    button.className = "primary-button";
    button.innerText = label;
    return button;
}

//when user click on start button
volumes.forEach((volume) => {
    const createdButton = createVolumeButton(volume.label);
    startScreen.appendChild(createdButton);

    createdButton.addEventListener("click", () => {
        initial(volume.filePath);
    });
});
