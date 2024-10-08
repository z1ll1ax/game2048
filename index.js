const cellContainer = document.querySelector('.game-container');
const cells = document.querySelectorAll('.game-cell');
const score = document.querySelector('.score-container h1');
const record = document.querySelector('.record-container h1');
const startButton = document.querySelector('.game-start-button');
const blurDiv = document.querySelector('.blur');

let field = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
let gameIsON = false;
if (localStorage.getItem('record')){
    record.textContent = localStorage.getItem('record');
}
else record.textContent = 0;
//TODO: fix ineractions, 32 32 64 0 => 128 but should be 64 64
//TODO: game ends wrongly maybe
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
    score.textContent = 0;
    blurDiv.style.display = 'none';
    RestartCells();
    RenderCells();
    SpawnCells();
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
function SpawnCells(){
    let emptys = getEmptys();
    switch (true){
        case emptys.length < 1: return;
        case emptys.length >= 2:
            let temp = Math.floor(Math.random() * emptys.length);
            let temp2 = Math.floor(Math.random() * emptys.length);
            while (temp === temp2) {
                temp2 = Math.floor(Math.random() * emptys.length);
            }
            RewriteCell(emptys[temp][0] * 4 + emptys[temp][1], 2);
            RewriteCell(emptys[temp2][0] * 4 + emptys[temp2][1], 2);
            break;
        case (emptys.length === 1):
            let temp3 = Math.floor(Math.random() * emptys.length);
            RewriteCell(emptys[temp3][0] * 4 + emptys[temp3][1], 2);
            break;
        default:
           return;
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
    console.log('up');
    let newField = Up();
    if (arraysEqual(newField, field) && !getEmptysSizePositive()){
        isLose();
        return;
    }
    field = newField;
    SpawnCells();
    RenderCells();
}
function Up(){
    field = transpose(field);
    let newField = Left();
    field = transpose(field);
    newField = transpose(newField);
    return newField;
}
function MoveDown(){
    console.log('d');
    let newField = Down();
    if (arraysEqual(newField, field) && !getEmptysSizePositive()){
        isLose();
        return;
    }
    field = newField;
    SpawnCells();
    RenderCells();
}
function Down(){
    field = transpose(field);
    let newField = Right();
    field = transpose(field);
    newField = transpose(newField);
    return newField;
}
function MoveLeft(){
    console.log('l');
    let newField = Left();
    if (arraysEqual(newField, field) && !getEmptysSizePositive()){
        isLose();
        return;
    }
    field = newField;
    SpawnCells();
    RenderCells();
}
function Left(){
    let tempField = [...field];
    for (let i = 0; i < 4; i++){
        tempField[i] = tempField[i].filter((element) => element !== 0);
        for (let j = 0; j < 3; j++){
            if (tempField[i][j] !== undefined && tempField[i][j] === tempField[i][j + 1]){
                tempField[i][j] *= 2;
                AddScore(tempField[i][j]);
                tempField[i].splice(j + 1, 1);
            }
        }
        while (tempField[i].length < 4) tempField[i].push(0);
    }
    return tempField;
}
function MoveRight(){
    console.log('r');
    let newField = Right();
    if (arraysEqual(newField, field) && !getEmptysSizePositive()){
        isLose();
        return;
    }
    field = newField;
    SpawnCells();
    RenderCells();
}
function Right(){
    let tempField = [...field];
    for (let i = 0; i < 4; i++){
        tempField[i] = tempField[i].filter((element) => element !== 0);
        for (let j = 3; j > 0; j--){
            if (tempField[i][j] !== undefined && tempField[i][j] === tempField[i][j - 1]){
                tempField[i][j] *= 2;
                AddScore(tempField[i][j]);
                tempField[i].splice(j - 1, 1);
            }
        }
        while (tempField[i].length < 4) tempField[i].unshift(0);
    }
    return tempField;
}
function isLose(){
    if (arraysEqual(Up(), field) && arraysEqual(Down(), field) &&
            arraysEqual(Left(), field) && arraysEqual(Right(), field)){
        gameIsON = false;
        blurDiv.style.display = 'block';
        if (parseInt(record.textContent) < parseInt(score.textContent)){
            record.textContent = score.textContent;
            localStorage.setItem('record', score.textContent);
        }
    }
}