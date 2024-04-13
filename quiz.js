let quizData;

async function LoadQuestion () {
  const res = await fetch('http://localhost:3000/tasks')
  const data = await res.json()
  quizData = data;
  startQuiz();
}

// const quizData=[
//     {
//        "difficulty": "easy",
//         "question": "2 + 2 =",
//         "options": ["3", "4", "5", "6"],
//         "answer": "4"
//     },
//     {
//         "difficulty": "medium",
//         "question": "ABCD....",
//         "options": ["E", "F", "G", "H"],
//         "answer": "E"
//     },
//     {
//         "difficulty": "hard",
//         "question": "1 % 4 =",
//         "options": ["1", "2", "3", "4"],
//         "answer": "1"
//     },{
//         "difficulty": "medium",
//         "question": "CQ Full Form",
//         "options": ["Code Queen", "Code Qutient", "Comming Quarter"],
//         "answer": "Code Qutient"
//     }
// ]


let currentQuestion = 0;
let score = 0;
let timeLeft; 
let timer;

function startQuiz() {
    if (!quizData) {
        console.error('Quiz data is not loaded properly.');
        return;
    }

    quizData.sort(() => Math.random() - 0.5);
    quizData.forEach((question) => {
        question.options.sort(() => Math.random() - 0.5);
    });

    // for (let i = quizData.length - 1; i > 0; i--) {
    //     const j = Math.floor(Math.random() * (i + 1));
    //     [quizData[i], quizData[j]] = [quizData[j], quizData[i]];
    //   }
    // quizData.forEach((question) => {
    //     for (let i = question.options.length - 1; i > 0; i--) {
    //         const j = Math.floor(Math.random() * (i + 1));
    //         [question.options[i], question.options[j]] = [question.options[j], question.options[i]];
    //       }
    // });

    displayQuestion();
    startTimer();
}

function displayQuestion() {
    const questionElement = document.getElementById("question");
    const optionsElement = document.getElementById("options");
    
    document.getElementById("score").textContent = `Score: ${score}`;
    document.getElementById("num").textContent = `Q${currentQuestion+1}. (${quizData[currentQuestion].difficulty})`;

    questionElement.textContent = quizData[currentQuestion].question;
    optionsElement.innerHTML = ``;

    quizData[currentQuestion].options.forEach((option, index) => {
        const button = document.createElement("button");
        button.textContent = option;
        button.onclick = () => checkAnswer(option);
        optionsElement.appendChild(button);
    });
}

function checkAnswer(selectedOption) {
    clearInterval(timer); 
    const correctAnswer = quizData[currentQuestion].answer;
    const feedbackElement = document.getElementById("feedback");
    if (selectedOption === correctAnswer) {
        feedbackElement.textContent = "Correct!";
        feedbackElement.className = "correct";
        score++;
    } else {
        if(selectedOption === undefined || selectedOption === null)
        {
            feedbackElement.textContent = "Not Attempted";
            feedbackElement.className = "notAttempt";
        }
        else
        {
            feedbackElement.textContent = "Incorrect!";
            feedbackElement.className = "incorrect";
        }
        
    }

    currentQuestion++;
    if (currentQuestion < quizData.length) {
        setTimeout(() => {
            document.getElementById("score").textContent = `Score: ${score}`;
            displayQuestion();
            startTimer();
            feedbackElement.textContent = "";
        }, 1000); 
    } else {

        function stopQuiz() {
            endQuiz();
        }
        
        setTimeout(stopQuiz, 1000);
        
    }
}

function startTimer() {
    timeLeft = 30;
    timer = setInterval(() => {
        if (timeLeft > 0) {
            document.getElementById("timer").textContent = `Time Left: ${timeLeft} seconds`;
            timeLeft--;
        } else {
            document.getElementById("timer").textContent = `Time Left: ${timeLeft} seconds`;
            clearInterval(timer);
            checkAnswer(null); 
        }
    }, 1000);
}

function endQuiz() {
    clearInterval(timer); 
    const quizContainer = document.querySelector(".quiz-container");
    quizContainer.innerHTML = `
        <h2>Quiz Completed!</h2>
        <p>Your Score: ${score} out of ${quizData.length}</p>
    `;
}

// startQuiz();
LoadQuestion();