const cellContainer = document.querySelector('.game-container');
const cells = document.querySelectorAll('.game-cell');
const score = document.querySelector('.score-container h1');
const record = document.querySelector('.record-container h1');
const startButton = document.querySelectorAll('.game-start-button');

let field = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
let gameIsON = false;
if (localStorage.getItem('record')){
    record.textContent = localStorage.getItem('record');
}
else record.textContent = 0;

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
    RestartCells();
    RenderCells();
    SpawnCells();
    RenderCells();
    document.querySelector('.game-start-button h1').textContent = 'RESTART';
    // if (parseInt(score.textContent) > parseInt(record.textContent)) {
    //     //TODO: Record saving in localStorage
    //     localStorage.setItem('record', score.textContent);
    // }
    gameIsON = true;
}
function AddScore(value){
    score.textContent = parseInt(score.textContent) + value;
}
function SpawnCells(){
    let emptys = [];
    for (let i = 0; i < 4; i++){
        for (let j = 0; j < 4; j++){
            if (field[i][j] === 0) emptys.push([i, j]);
        }
    }
    if (emptys.length < 2) {
        gameIsON = false;
        if (parseInt(record.textContent) < parseInt(score.textContent)){
            record.textContent = score.textContent;
            localStorage.setItem('record', score.textContent);
        }
        return;
    }
    let temp = Math.floor(Math.random() * emptys.length);
    let temp2 = Math.floor(Math.random() * emptys.length);
    while (temp === temp2) {
        temp2 = Math.floor(Math.random() * emptys.length);
    }
    RewriteCell(emptys[temp][0] * 4 + emptys[temp][1], 2);
    RewriteCell(emptys[temp2][0] * 4 + emptys[temp2][1], 2);
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
function MoveUp(){
    console.log('up');
    field = transpose(field);
    for (let i = 0; i < 4; i++){
        field[i] = field[i].filter((element) => element !== 0);
        for (let j = 0; j < 3; j++){
            if (field[i][j] !== undefined && field[i][j] === field[i][j + 1]){
                field[i][j] *= 2;
                AddScore(field[i][j]);
                field[i].splice(j + 1, 1);
            }
        }
        while (field[i].length < 4) field[i].push(0);
    }
    field = transpose(field);
    SpawnCells();
    RenderCells();
}
function MoveDown(){
    console.log('d');
    field = transpose(field);
    for (let i = 0; i < 4; i++){
        field[i] = field[i].filter((element) => element !== 0);
        for (let j = 3; j > 0; j--){
            if (field[i][j] !== undefined && field[i][j] === field[i][j - 1]){
                field[i][j] *= 2;
                AddScore(field[i][j]);
                field[i].splice(j - 1, 1);
            }
        }
        while (field[i].length < 4) field[i].unshift(0);
    }
    field = transpose(field);
    SpawnCells();
    RenderCells();
}
function MoveLeft(){
    console.log('l');
    for (let i = 0; i < 4; i++){
        field[i] = field[i].filter((element) => element !== 0);
        for (let j = 0; j < 3; j++){
            if (field[i][j] !== undefined && field[i][j] === field[i][j + 1]){
                field[i][j] *= 2;
                AddScore(field[i][j]);
                field[i].splice(j + 1, 1);
            }
        }
        while (field[i].length < 4) field[i].push(0);
    }
    SpawnCells();
    RenderCells();
}

function MoveRight(){
    console.log('r');
    for (let i = 0; i < 4; i++){
        field[i] = field[i].filter((element) => element !== 0);
        for (let j = 3; j > 0; j--){
            if (field[i][j] !== undefined && field[i][j] === field[i][j - 1]){
                field[i][j] *= 2;
                AddScore(field[i][j]);
                field[i].splice(j - 1, 1);
            }
        }
        while (field[i].length < 4) field[i].unshift(0);
    }
    SpawnCells();
    RenderCells();
}