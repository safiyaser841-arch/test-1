
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
let locked = false;

function startQuiz() {
    currentQuestion = 0;
    locked = false;

    audioContext = new (
        window.AudioContext || window.webkitAudioContext
    )();

    showQuestion();
}

function showQuestion() {
    locked = false;

    document.getElementById("monster").classList.remove("scare");
    document.body.classList.remove("scary");
    document.getElementById("message").textContent = "";

    const q = questions[currentQuestion];

    document.getElementById("question").textContent = q.question;

    const answers = document.getElementById("answers");
    answers.innerHTML = "";

    q.answers.forEach(answer => {
        const button = document.createElement("button");
        button.textContent = answer;
        button.onclick = triggerJumpscare;
        answers.appendChild(button);
    });
}

function triggerJumpscare() {
    if (locked) return;
    locked = true;

    document.getElementById("monster").classList.add("scare");
    document.body.classList.add("scary");

    document.getElementById("message").textContent =
        "WRONG ANSWER!!!";

    document.getElementById("answers").innerHTML = "";

    playScream();

    setTimeout(() => {
        document.getElementById("monster").classList.remove("scare");
        document.body.classList.remove("scary");

        currentQuestion++;

        if (currentQuestion < questions.length) {
            showQuestion();
        } else {
            finishQuiz();
        }
    }, 1600);
}

function playScream() {
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const second = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sawtooth";
    second.type = "square";

    oscillator.frequency.setValueAtTime(
        1100, audioContext.currentTime
    );

    oscillator.frequency.exponentialRampToValueAtTime(
        160, audioContext.currentTime + 1.1
    );

    second.frequency.setValueAtTime(
        750, audioContext.currentTime
    );

    second.frequency.exponentialRampToValueAtTime(
        100, audioContext.currentTime + 1.1
    );

    gain.gain.setValueAtTime(
        0.0001, audioContext.currentTime
    );

    gain.gain.linearRampToValueAtTime(
        0.10, audioContext.currentTime + 0.08
    );

    gain.gain.exponentialRampToValueAtTime(
        0.0001, audioContext.currentTime + 1.1
    );

    oscillator.connect(gain);
    second.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    second.start();

    oscillator.stop(audioContext.currentTime + 1.1);
    second.stop(audioContext.currentTime + 1.1);
}

function finishQuiz() {
    document.getElementById("question").textContent =
        "YOU SURVIVED... OR DID YOU?";

    document.getElementById("message").textContent =
        "CONGRATULATIONS. ZERO CORRECT ANSWERS.";

    document.getElementById("restart").style.display = "block";
    document.getElementById("answers").innerHTML = "";
}

function restartQuiz() {
    document.getElementById("restart").style.display = "none";
    document.getElementById("message").textContent = "";

    document.getElementById("answers").innerHTML =
        '<button onclick="startQuiz()">START QUIZ</button>';

    document.getElementById("question").textContent =
        "Are you ready?";
}
