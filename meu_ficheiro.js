var jsonData = null;
let COUNTER = 0
let SCORE = 0


async function startGame() {
    
    // Makes landing page disappear
    document.getElementById("landing-page").style.display = "none";


    // Read Questions JSON file
    jsonData = await readJsonFile("questions.json");

    // Calls the first question of the game
    createQuestionPage();
}   


function createQuestionPage() {
    let myQuiz = document.getElementById("my-quiz");
    myQuiz.style.gap = "0px";
    
    let myQuizHeader = document.getElementById("my-quiz-header");
    myQuizHeader.style.fontSize = "3em";

    // Create Quiz area
    let questionsArea = document.createElement("div");
    questionsArea.id = "questions-area"

    // Create Question part
    let quizQuestion = document.createElement("h4");
    quizQuestion.id = "question-header"
    let quizQuestionText = document.createTextNode(jsonData[0].pergunta);
    quizQuestion.appendChild(quizQuestionText);
    questionsArea.appendChild(quizQuestion);

    // Create Answers part
    let quizAnswers = document.createElement("div");
    quizAnswers.id = "my-answers"

    for (let i=0; i<4; i++) {
        let quizAnswer = document.createElement("div");
        quizAnswer.className = "answers"
        let quizAnswerText = document.createTextNode(jsonData[0].opcoes[i]);
        quizAnswer.appendChild(quizAnswerText);
        quizAnswer.onclick = checkQuizAnswer
        quizAnswers.appendChild(quizAnswer);
    }

    questionsArea.appendChild(quizAnswers);

    // Create Progress div
    let progressIndicator =document.createElement("div");
    progressIndicator.id = "progress-indicator";
    progressIndicator.ariaLive = "polite";
    let progressIndicatorText = document.createTextNode("1 de " + jsonData.length + " perguntas");
    progressIndicator.appendChild(progressIndicatorText);
    questionsArea.appendChild(progressIndicator);

    // Create Next button part
    let quizButton = document.createElement("button");
    quizButton.id = "next-button";
    quizButton.disabled = true;
    let buttonText = document.createTextNode("Seguinte");
    quizButton.appendChild(buttonText);
    quizButton.onclick = createNewQuestion
    questionsArea.appendChild(quizButton);

    myQuiz.appendChild(questionsArea);
}


function createNewQuestion() {

    // Nova questão, incrementa o counter
    COUNTER++;

    // Check if there are more questions
    if (COUNTER < jsonData.length) {
        // Update the question header
        document.getElementById("question-header").textContent = jsonData[COUNTER].pergunta;

        // Update the answers
        let quizAnswers = document.getElementById("my-answers");
        quizAnswers.innerHTML = ''; // Clear previous answers

        for (let i = 0; i < 4; i++) {
            let quizAnswer = document.createElement("div");
            quizAnswer.className = "answers answer-" + i;
            let quizAnswerText = document.createTextNode(jsonData[COUNTER].opcoes[i]);
            quizAnswer.appendChild(quizAnswerText);
            quizAnswer.onclick = checkQuizAnswer
            quizAnswers.appendChild(quizAnswer);
        }

        // Update Progress div
        document.getElementById("progress-indicator").textContent = (COUNTER+1) + " de " + jsonData.length + " perguntas";

        // Disable Next button until question is pressed
        document.getElementById('next-button').disabled = true;

    } else {
        endGame(); // Call the endGame function if there are no more questions
    }
}


function checkQuizAnswer(element) {

    // Deactive that people click on answers for the round
    deactivateOnclick();

    // Enable next button to move to next question
    enableNextButton()

    if (element.target.textContent === jsonData[COUNTER].resposta_correta) {

        // Add styling for showing its the right answer
        element.target.style.border = "2px solid green";
        element.target.style["background-color"] = "lightgreen";

        SCORE++;
    } else {
        // Add styling for showing its the wrong answer
        element.target.style.border = "2px solid red";
        element.target.style["background-color"] = "lightpink";

        // Show right answer
        let answers = document.getElementsByClassName("answers");

        for (let index = 0; index < 4; index++) {

            if (answers[index].textContent === jsonData[COUNTER].resposta_correta) {
                answers[index].style.border = "2px solid green";
                answers[index].style["background-color"] = "lightgreen";

                break;
            }
        }
    }

}


function enableNextButton() {
    document.getElementById('next-button').disabled = false;
}


function deactivateOnclick() {
    /* Helper function */

    // Show right answer
    let answers = document.getElementsByClassName("answers");

    for (let index = 0; index < 4; index++) {
        // Turn onclick events off for the round
        answers[index].onclick = null;
    }
}


function endGame() {

    // Makes answers page disappear
    document.getElementById("my-quiz").style.display = "none";

    // Create Quiz area
    let scoreArea = document.createElement("div");
    scoreArea.id = "score-area";

    // Create Score Header
    let scoreHeader =document.createElement("div");
    scoreHeader.id = "score-header";
    let scoreHeaderText = document.createTextNode("O teu score final é");
    scoreHeader.appendChild(scoreHeaderText);
    scoreArea.appendChild(scoreHeader);

    // Create Score 
    let scoreDiv =document.createElement("div");
    scoreDiv.id = "score";
    let scoreText = document.createTextNode(SCORE + " em " + jsonData.length + "!");
    scoreDiv.appendChild(scoreText);
    scoreArea.appendChild(scoreDiv);

    // Add Restart button
    let restartButton = document.createElement("button");
    restartButton.id = "restart-button";
    let restartButtonText = document.createTextNode("Novo Jogo?");
    restartButton.appendChild(restartButtonText);
    restartButton.onclick = newGame;
    scoreArea.appendChild(restartButton);

    document.getElementById("my-game").appendChild(scoreArea);
}


function newGame() {
    COUNTER = 0;
    SCORE = 0;
    location.reload();
}





async function readJsonFile(nameOfJsonFile) {
    try {
        const response = await fetch(nameOfJsonFile);
        if (!response.ok) throw new Error('Network error: ' + response.statusText);
        return await response.json(); // Parse and store JSON Data
    } catch (error) {
        console.error('Fetch error:', error);
        alert('Failed to load questions. Please try again later.');
        return [];
    }
}