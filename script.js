
const questions = [
    {
        question: "What is 2 + 2?",
        answers: ["4", "5", "22", "100"]
    },
    {
        question: "Which planet do we live on?",
        answers: ["Earth", "Mars", "Jupiter", "The Moon"]
    },
    {
        question: "What color is the sky?",
        answers: ["Blue", "Green", "Red", "Black"]
    },
    {
        question: "Are you alone right now?",
        answers: ["Yes", "No", "Maybe", "I don't know"]
    },
    {
        question: "Do you want to continue?",
        answers: ["Yes", "No", "Definitely", "Never"]
    }
];

let currentQuestion = 0;
let audioContext;

function startQuiz() {
    currentQuestion = 0;
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    showQuestion();
}

function showQuestion() {
    document.getElementById("monster").classList.remove("scare");
    document.body.classList.remove("scary");
    document.getElementById("message").textContent = "";

    const question = questions[currentQuestion];

    document.getElementById("question").textContent = question.question;

    const answers = document.getElementById("answers");
    answers.innerHTML = "";

    question.answers.forEach(answer => {
        const button = document.createElement("button");
        button.textContent = answer;
        button.onclick = triggerJumpscare;
        answers.appendChild(button);
    });
}

function triggerJumpscare() {
    document.getElementById("monster").classList.add("scare");
    document.body.classList.add("scary");

    document.getElementById("message").textContent =
        "WRONG ANSWER!!!";

    playScream();

    document.getElementById("answers").innerHTML = "";

    setTimeout(() => {
        currentQuestion++;

        if (currentQuestion < questions.length) {
            showQuestion();
        } else {
            finishQuiz();
        }
    }, 1200);
}

function playScream() {
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(900, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
        180,
        audioContext.currentTime + 0.7
    );

    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(
        0.15,
        audioContext.currentTime + 0.05
    );
    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audioContext.currentTime + 0.8
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.8);
}

function finishQuiz() {
    document.getElementById("monster").classList.remove("scare");
    document.body.classList.remove("scary");

    document.getElementById("question").textContent =
        "YOU SURVIVED... OR DID YOU?";

    document.getElementById("message").textContent =
        "You got 0 correct answers. Congratulations!";

    document.getElementById("restart").style.display = "block";
}

function restartQuiz() {
    document.getElementById("restart").style.display = "none";
    document.getElementById("answers").innerHTML =
        '<button onclick="startQuiz()">START QUIZ</button>';

    document.getElementById("question").textContent = "Are you ready?";
    document.getElementById("message").textContent = "";
}
