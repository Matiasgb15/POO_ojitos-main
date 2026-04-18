class FiguraOjos {

 constructor(x, y, size) {

  this.x = x;

  this.y = y;

  this.size = size;

 }


 show() {
 fill(235);

  ellipse (this.x, this.y, this.size* 1);
 
  fill (0);

  rect(this.x - this.size * 1, this.y - this.size *0.5, this.size * 2,this.size);

  fill(255,250,200);

  circle(this.x - this.size * 0.5, this.y, this.size);

  fill(0, 0, 0);

  circle(this.x - this.size * 0.3, this.y - this.size * 0.15, this.size * 0.33);



  fill(255,250,200);

  circle(this.x + this.size * 0.5, this.y, this.size);

  fill(0);

  circle(this.x + this.size * 0.7, this.y - this.size * 0.15, this.size * 0.33);

  fill(0); 

 

 

 }

}


let figura;
let video;
let faceMesh;
let eyeX = 200;
let eyeY = 200;

const questions = [
  { text: 'La tierra es plana.', answer: 'falso' },
  { text: 'El agua hierve a 100°C al nivel del mar.', answer: 'verdadero' },
  { text: 'El sol es un planeta.', answer: 'falso' },
  { text: 'La luna tiene luz propia.', answer: 'falso' },
  { text: 'Los seres humanos tienen 206 huesos.', answer: 'verdadero' },
  { text: 'La electricidad puede viajar a través del vacío.', answer: 'verdadero' },
  { text: 'El oro es magnético.', answer: 'falso' },
  { text: 'El agua está compuesta de hidrógeno y oxígeno.', answer: 'verdadero' },
  { text: 'Los pingüinos pueden volar.', answer: 'falso' },
  { text: 'La velocidad de la luz es mayor que la del sonido.', answer: 'verdadero' }
];

let currentQuestion = null;
let questionActive = false;
let faceDetected = false;
let feedbackColor = null;
let feedbackStart = 0;
let score = 0;
let gameOver = false;
let stableAnswer = null;
let answerStartTime = 0;
const answerHoldTime = 700;

function setup() {
  createCanvas(400, 400);
  frameRate(24);

  video = createCapture(VIDEO);
  video.size(400, 400);
  video.hide();

  figura = new FiguraOjos(200, 200, 60);

  faceMesh = new FaceMesh({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
  });

  faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  });

  faceMesh.onResults(onResults);

  const camera = new Camera(video.elt, {
    onFrame: async () => {
      await faceMesh.send({ image: video.elt });
    },
    width: 400,
    height: 400
  });
  camera.start();
}

function onResults(results) {
  faceDetected = false;

  if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
    faceDetected = true;
    const landmarks = results.multiFaceLandmarks[0];
    const leftEye = landmarks[33];
    const rightEye = landmarks[263];

    eyeX = map((leftEye.x + rightEye.x) / 2, 0, 1, width, 0);
    eyeY = map((leftEye.y + rightEye.y) / 2, 0, 1, 0, height);

    if (!gameOver) {
      if (!currentQuestion) {
        nextQuestion();
      }

      if (currentQuestion && !feedbackColor) {
        const answer = getFaceAnswer();
        if (answer) {
          if (stableAnswer === answer) {
            if (millis() - answerStartTime > answerHoldTime) {
              checkAnswer(answer);
            }
          } else {
            stableAnswer = answer;
            answerStartTime = millis();
          }
        } else {
          stableAnswer = null;
          answerStartTime = 0;
        }
      }
    }
  }
}

function draw() {
  if (feedbackColor) {
    background(feedbackColor);
  } else if (gameOver) {
    background(20, 20, 20);
  } else {
    background(45, 150, 200);
  }

  if (!faceDetected && !gameOver) {
    drawMessage('¿Quién quiere ser millonario?', 'Acerca tu rostro para responder');
  }

  if (faceDetected && currentQuestion && !gameOver) {
    drawQuestion(currentQuestion.text);
  }

  if (gameOver) {
    drawMessage('Juego terminado', `Puntaje final: ${score}`);
  }

  drawScore();

  if (feedbackColor && millis() - feedbackStart > 1200) {
    feedbackColor = null;
    if (!gameOver) {
      nextQuestion();
    }
  }

  figura.x = eyeX;
  figura.y = eyeY;
  figura.show();
}

function nextQuestion() {
  const index = floor(random(questions.length));
  currentQuestion = questions[index];
  questionActive = true;
}

function getFaceAnswer() {
  const leftZone = width * 0.35;
  const rightZone = width * 0.65;

  if (eyeX < leftZone) {
    return 'verdadero';
  }

  if (eyeX > rightZone) {
    return 'falso';
  }

  return null;
}

function checkAnswer(answer) {
  if (!currentQuestion) return;

  if (answer === currentQuestion.answer) {
    feedbackColor = color(0, 200, 100);
    score += 1;
  } else {
    feedbackColor = color(200, 50, 50);
    score = max(0, score - 1);
  }

  feedbackStart = millis();
  questionActive = false;
  currentQuestion = null;
  stableAnswer = null;
  answerStartTime = 0;

  if (score >= 10) {
    gameOver = true;
  }
}

function drawQuestion(questionText) {
  noStroke();
  fill(0, 0, 0, 240);
  rect(10, 10, width - 20, 160, 18);

  fill(255);
  textAlign(LEFT, TOP);
  textSize(18);
  text(questionText, 20, 16, width - 80, 80);

  fill(255, 220, 0);
  textSize(14);
  text('IZQUIERDA = VERDADERO', 20, 100);
  text('DERECHA = FALSO', 20, 122);

  textSize(12);
  fill(255);
  text('Mantén tu rostro en el lado elegido para confirmar', 20, 142, width - 80, 40);
}

function drawScore() {
  fill(255);
  textAlign(LEFT, BOTTOM);
  textSize(16);
  text(`Puntaje: ${score}`, 20, height - 10);
}

function drawMessage(title, subtitle) {
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(24);
  text(title, width / 2, height / 2 - 20);
  textSize(16);
  text(subtitle, width / 2, height / 2 + 20);
}
