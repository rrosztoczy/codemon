// Sounds like a monster class with wild/caught parameters, generated from API data
let monstersFromAPI = []
, wildMonsters = []
, caughtMonsters = []
, selectedMonster = {}
, caughtCode = []
, monsterBoundaries = [];

// Adapter for fetches etc.
let monsterAdapter = adapter('https://floating-bayou-89751.herokuapp.com/');

// DOM Variables
const quizContainer = document.getElementById('quiz-container')
, codemonBelt = document.getElementById('codemon-belt')
, button = document.getElementById('butt');

//Map Border Values
const topBorder = 51.51175
, bottomBorder = 51.50245
, rightBorder = -0.15621
, leftBorder = -0.18758
, borderBuffer = 0.0006
, startLatitude = 51.50789
, startLongitude = -0.16825;

let intersection = false
, horizontal = 0
, vertical = 0
, latitude = () => {
  return startLatitude + vertical
} 
, longitude = () => {
  return startLongitude + horizontal
}
, center = () => {
   return [latitude(), longitude()] 
  }
, map = L.map('map', {drawControl: false, zoomControl: false}).setView(center(), 17);
map.scrollWheelZoom.disable();
map.keyboard.disable();

//Global values for our player icon movement event listeners

const keyCodes = [37, 38, 39, 40]
, warning = 'No capturing of codemon! Codemon catching is only allowed in this park!';

//Player Icon and Attributes
let myIcon = L.icon({
    iconUrl: './images/littleman.gif',
    iconSize: [80, 80]
  });

let icon = L.marker(center(), {
    autoPan: true,
    autoPanSpeed: 10,
    icon: myIcon,
    zIndexOffset: 1500
  }).addTo(map)

let circle = new L.Circle(center(), 35, {color: 'red', display: 'none'}).addTo(map);

//Building our Map
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
 attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//-------------------------------------------Application Interaction-------------------------------------------------------------/

//********************************Player Movement Logic*************************************/
document.addEventListener("keydown", movePlayer);

// Execute movement
function movePlayer(e) {
  switch (e.keyCode) {
  case 39: playerStep(right)
  break;
  case 37: playerStep(left, left())
  break;
  case 38: playerStep(up)
  break;
  case 40: playerStep(down)
  break;
  default: alert("Please press an arrow key");
}
}

// Step direction movement and boundary checks
function left() {
  if (leftBorder <= longitude() + borderBuffer) {
    return horizontal -= 0.0005;
  }
}
function right() {
  if (rightBorder >= longitude() - borderBuffer) {
    horizontal += 0.0005;
  }
}
function up() {
  if (topBorder >= latitude() + borderBuffer) {
    return vertical += 0.0005;
  }
}
function down() {
  if (bottomBorder <= latitude() - borderBuffer) {
    return vertical -= 0.0005;
}
}

function playerStep(direction) {
  // Remove current map layer
  map.removeLayer(icon);
  map.removeLayer(circle);
  // Generate new layer at movement position
  let newIcon;
  let newCircle;
  direction()
  newIcon = L.marker(center(), {
    autoPan: true,
    autoPanSpeed: 10,
    icon: myIcon,
    zIndexOffset: 1000
  }).addTo(map)
  icon = newIcon;
  newCircle = new L.Circle(center(), 35, {color: 'red', opacity: 0.001}).addTo(map)
  circle = newCircle;
  map.panTo(icon.getLatLng());

  // check for Codemon interaction
  initiateQuiz(checkIntersection())
}

// ******************************************Codemon Interaction Logic******************************

function checkIntersection() {
  let foundMonster = wildMonsters.find(monster => {
    return monster.monsterBorder.getBounds().intersects(circle.getBounds())
  })
    return foundMonster
}

function initiateQuiz(monster) {
  if (monster) {
      renderBattle(monster)
  }
}

quizContainer.addEventListener('click', function(e){
  if (e.target.dataset.correct === "true") {
    catchMonster(selectMonster(e))
  } else if (e.target.dataset.correct === "false") {
    monsterFled(selectMonster(e))
  }
})

// *****************************Code for Quiz***********************************************

function renderQuestion(monster) {
  const questionBox = document.createElement('div')
  // TODO: refactor to pull random question from this monsters question list after mvp
  questionBox.className = "question"
  questionBox.innerHTML += `<div class="card">
  <div class="card-header">
    Codemon Quiz! Now is your chance to catch ${monster.name}!
  </div>
  <div class="card-body">
    <blockquote class="blockquote mb-0">
      <p>${monster.questions[0].question_text}</p>
    </blockquote>
  </div>
</div>`
  quizContainer.appendChild(questionBox)
  questionBox.style.gridArea = "quizHeader"
}

function renderAnswer(answer) {
  const answerBox = document.createElement('div')
  answerBox.className = "answer"
  answerBox.dataset.letter = answer.letter
  answerBox.dataset.correct = answer.correct
  answerBox.innerHTML += `<div data-correct="${answer.correct}" class="card">
  <div data-correct="${answer.correct}" class="card-header">
  ${answer.letter}
  </div>
  <div data-correct="${answer.correct}" class="card-body">
    <blockquote data-correct="${answer.correct}" class="blockquote mb-0">
      <p data-correct="${answer.correct}">${answer.answer_text}</p>
    </blockquote>
  </div>
</div>`

  quizContainer.appendChild(answerBox)
  answerBox.style.gridArea = "question"+answer.letter
}

function renderBattle(monster) {
  clearQuiz()
  quizContainer.dataset.monstername = monster.name
  renderQuestion(monster)
  monster.answers.forEach(renderAnswer)
}

// ********************************Interaction Outcome Logic*******************************
function selectMonster(e) {
  let grandparentMonsterName = e.target.parentNode.parentNode.dataset.monstername
  , greatGrandparentMonsterName = e.target.parentNode.parentNode.parentNode.dataset.monstername
  , greatGreatGreatGrandparentMonsterName = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.dataset.monstername;
  if (grandparentMonsterName) {
    selectedMonster = wildMonsters.find(monster => monster.name === grandparentMonsterName)
  } else if (greatGrandparentMonsterName) {
    selectedMonster = wildMonsters.find(monster => monster.name === greatGrandparentMonsterName)
  } else if (greatGreatGreatGrandparentMonsterName) {
    selectedMonster = wildMonsters.find(monster => monster.name === greatGreatGreatGrandparentMonsterName)
  }
  return selectedMonster
}

function clearQuiz() {
  quizContainer.innerHTML = ""
}

function removeMonster(monster) {
  map.removeLayer(monster.monsterBorder);
  map.removeLayer(monster.marker);
}

function monsterFled(monster) {
  removeMonster(monster)
  monster.monsterBorder = null
  wildMonsters.splice(wildMonsters.indexOf(monster),1)
  clearQuiz()
}

function catchMonster(monster) {
  ++caughtCode
  monster.caughtOrder = caughtCode
  caughtMonsters.push(monster)
  renderCodemonBelt(monster)
  removeMonster(monster)
  monster.monsterBorder = null
  wildMonsters.splice(wildMonsters.indexOf(monster),1)
  clearQuiz()
}

// **********************************Successful Catch Functions**************************************

function renderCodemonBelt(monster) {
  renderNumber(monster)
  renderCaughtCodemonImg(monster)
  renderCaughtCodemonName(monster)
}

function renderNumber(monster) {
  const caughtNum = document.createElement('div')
  caughtNum.innerText = monster.caughtOrder
  caughtNum.className = "caught-num"
  codemonBelt.appendChild(caughtNum)
  caughtNum.style.gridArea = "codemon" + monster.caughtOrder + "Num"
}

function renderCaughtCodemonImg(monster) {
  const caughtImgDiv = document.createElement('div')
  const caughtImg = document.createElement('img')
  caughtImg.src = monster.image
  caughtImgDiv.className = "caught-img"
  caughtImg.className = "caught-img"
  caughtImgDiv.appendChild(caughtImg)
  codemonBelt.appendChild(caughtImgDiv)
  caughtImgDiv.style.gridArea = "codemon" + monster.caughtOrder +  "Img"
}

function renderCaughtCodemonName(monster) {
  const caughtName = document.createElement('div')
  caughtName.innerText = monster.name
  caughtName.className = "caught-name"
  codemonBelt.appendChild(caughtName)
  caughtName.style.gridArea = "codemon" + monster.caughtOrder + "Name"
}



button.addEventListener('click', buttonClick)

function buttonClick(e) {
  if (e.target.id === 'butt') {
    document.getElementById('mysupercontainer').innerHTML = '';
  }
}
