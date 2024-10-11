const cellContainer = document.querySelector('.game-container');
const cells = document.querySelectorAll('.game-cell');
const score = document.querySelector('.score-container h1');
const record = document.querySelector('.record-container h1');
const startButton = document.querySelector('.game-start-button');
const blurDiv = document.querySelector('.blur');
const tableScores = document.querySelectorAll('.table-score');

let field = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
let lastScores = localStorage.getItem('lastTenScores');
let gameIsON = false;
let popSound = new Audio();
let loseSound = new Audio();
popSound.src = 'assets/pop-sound.mp3';
loseSound.src = 'assets/josh-hutcherson-whistle.mp3';

if (localStorage.getItem('record')){
    record.textContent = localStorage.getItem('record');
}
else record.textContent = 0;
if (!lastScores){
    lastScores = [];
}
else {
    lastScores = lastScores.split(',');
    RenderLastTenScores();
}
document.addEventListener('keydown', function(event) {
    if (gameIsON)
        switch(event.key) {
            case 'w':
            case 'W':
            case 'ArrowUp':
                MoveUp();
                break;
            case 'a':
            case 'A':
            case 'ArrowLeft':
                MoveLeft();
                break;
            case 's':
            case 'S':
            case 'ArrowDown':
                MoveDown();
                break;
            case 'd':
            case 'D':
            case 'ArrowRight':
                MoveRight();
                break;
        }
});

function StartGame(){
    popSound.pause();
    popSound.currentTime = 0;
    loseSound.pause();
    loseSound.currentTime = 0;
    if (parseInt(record.textContent) < parseInt(score.textContent)){
        record.textContent = score.textContent;
        localStorage.setItem('record', score.textContent);
    }
    score.textContent = 0;
    blurDiv.style.display = 'none';
    RestartCells();
    SpawnCell();
    RenderCells();
    document.querySelector('.game-start-button h1').textContent = 'RESTART';
    gameIsON = true;
}
function AddScore(value){
    score.textContent = parseInt(score.textContent) + value;
}
function getEmptys(){
    let emptys = [];
    for (let i = 0; i < 4; i++){
        for (let j = 0; j < 4; j++){
            if (field[i][j] === 0) emptys.push([i, j]);
        }
    }
    return emptys;
}
function getEmptysSizePositive(){
    let emptys = [];
    for (let i = 0; i < 4; i++){
        for (let j = 0; j < 4; j++){
            if (field[i][j] === 0) return true;
        }
    }
    return false;
}
function SpawnCell(){
    let emptys = getEmptys();
    if (emptys.length > 0){
        let temp = Math.floor(Math.random() * emptys.length); // which cell
        let multiplier = (Math.floor(Math.random() * 2) + 1) * 2; //2 or 4
        RewriteCell(emptys[temp][0] * 4 + emptys[temp][1], multiplier);
    }
}
function RenderCells(){
    for(let i = 0; i < cells.length; i++){
        cells[i].id = `n${field.flat()[i]}`;
        if (field.flat()[i] === 0)  cells[i].innerHTML = `<h3></h3>`
        else cells[i].innerHTML = `<h3>${field.flat()[i]}</h3>`;
    }
}
function RewriteCell(id, value){
    let idRow = 0;
    while (id > 3){
        idRow++;
        id-=4;
    }
    field[idRow][id] = value;
}
function RestartCells(){
    field = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
}
function transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
}
function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (Array.isArray(arr1[i]) && Array.isArray(arr2[i])) {
            if (!arraysEqual(arr1[i], arr2[i])) {
                return false;
            }
        } else {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }
    }
    return true;
}
function MoveUp(){
    let newField = Up(true);
    if (arraysEqual(newField, field) && !getEmptysSizePositive()){
        isLose();
        return;
    }
    field = newField;
    SpawnCell();
    RenderCells();
}
function Up(isMovedByPlayer){
    field = transpose(field);
    let newField = Left(isMovedByPlayer);
    field = transpose(field);
    newField = transpose(newField);
    return newField;
}
function MoveDown(){
    let newField = Down(true);
    if (arraysEqual(newField, field) && !getEmptysSizePositive()){
        isLose();
        return;
    }
    field = newField;
    SpawnCell();
    RenderCells();
}
function Down(isMovedByPlayer){
    field = transpose(field);
    let newField = Right(isMovedByPlayer);
    field = transpose(field);
    newField = transpose(newField);
    return newField;
}
function MoveLeft(){
    let newField = Left(true);
    if (arraysEqual(newField, field) && !getEmptysSizePositive()){
        isLose();
        return;
    }
    field = newField;
    SpawnCell();
    RenderCells();
}
function Left(isMovedByPlayer){
    let tempField = [...field];
    let isMerged = false;
    for (let i = 0; i < 4; i++){
        tempField[i] = tempField[i].filter((element) => element !== 0);
        for (let j = 0; j < 3; j++){
            if (tempField[i][j] !== undefined 
                && tempField[i][j] === tempField[i][j + 1]){
                tempField[i][j] *= 2;
                isMerged = true;
                if (isMovedByPlayer) AddScore(tempField[i][j]);
                tempField[i].splice(j + 1, 1);
            }
        }
        while (tempField[i].length < 4) tempField[i].push(0);
    }
    if (isMerged && isMovedByPlayer) popSound.play();
    return tempField;
}
function MoveRight(){
    let newField = Right(true);
    if (arraysEqual(newField, field) && !getEmptysSizePositive()){
        isLose();
        return;
    }
    field = newField;
    SpawnCell();
    RenderCells();
}
function Right(isMovedByPlayer){
    let tempField = [...field];
    let isMerged = false;
    for (let i = 0; i < 4; i++){
        tempField[i] = tempField[i].filter((element) => element !== 0);
        for (let j = 3; j > 0; j--){
            if (tempField[i][j] !== undefined && tempField[i][j] === tempField[i][j - 1]){
                tempField[i][j] *= 2;
                isMerged = true;
                if (isMovedByPlayer) AddScore(tempField[i][j]);
                tempField[i].splice(j - 1, 1);
            }
        }
        while (tempField[i].length < 4) tempField[i].unshift(0);
    }
    if (isMerged && isMovedByPlayer) popSound.play();
    return tempField;
}
function isLose(){
    if (arraysEqual(Up(false), field) && arraysEqual(Left(false), field)){
        gameIsON = false;
        loseSound.play();
        blurDiv.style.display = 'block';
        if (parseInt(record.textContent) < parseInt(score.textContent)){
            record.textContent = score.textContent;
            localStorage.setItem('record', score.textContent);
        }
        lastScores.push(parseInt(score.textContent));
        lastScores = lastScores.slice(-10);
        localStorage.setItem('lastTenScores', lastScores);
        RenderLastTenScores();
    }
}

function RenderLastTenScores(){
    for (let i = 0; i < lastScores.length || i < 10; i++){
        tableScores[i].textContent = lastScores[i];
    }
}