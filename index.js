const cellContainer = document.querySelector('.game-container');
const cells = document.querySelectorAll('.game-cell');
const score = document.querySelector('.score-container h1');
const record = document.querySelector('.record-container h1');

const field = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];

const startButton = document.querySelectorAll('.game-start-button');

function StartGame(){
    score.textContent = 0;
    RewriteAllCells();
    //generate 2 cells '2'
    let temp = Math.floor(Math.random() * 16);
    let temp2 = Math.floor(Math.random() * 16);
    while (temp === temp2) temp2 = Math.floor(Math.random() * 16);
    RewriteCell(cells[temp], 2);
    RewriteCell(cells[temp2], 2);

    document.querySelector('.game-start-button h1').textContent = 'RESTART';

    if (score.textContent > record.textContent) {
        //TODO: Record saving in localStorage
    }
}
function RewriteCell(cell, id){
    cell.id = `n${id}`;
    cell.innerHTML = `<h3>${id}</h3>`;
}
function RewriteAllCells(){
    for(let i = 0; i < cells.length; i++){
        cells[i].id = `n${field.flat()[i]}`;

        if (field.flat()[i] === 0)  cells[i].innerHTML = `<h3></h3>`
        else cells[i].innerHTML = `<h3>${field.flat()[i]}</h3>`;
    }
}
function RewriteCells(){
    
}
function MoveUp(){

}
function MoveDown(){
    
}
function MoveLeft(){
    
}
function MoveRight(){
    
}