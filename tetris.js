
function changeBg(){
	document.body.style.backgroundColor = "#" + (~~(Math.random()*(1<<24))).toString(16);
}

var createCanvas = function(TETRIS_ROWS, TETRIS_COLS, CELL_SIZE, CELL_SIZE){
	tetris_canvas = document.createElement("canvas");
	
	tetris_canvas.width = TETRIS_COLS * CELL_SIZE;
	tetris_canvas.height = TETRIS_ROWS * CELL_SIZE;
	tetris_canvas.style.border = "1px solid black";
	
	tetris_ctx = tetris_canvas.getContext('2d');
	
	tetris_ctx.beginPath();
	for(var i=1; i<TETRIS_ROWS; i++){
		tetris_ctx.moveTo(0, i*CELL_SIZE);
		tetris_ctx.lineTo(TETRIS_COLS*CELL_SIZE, i*CELL_SIZE);
	}
	for(var i=1; i<TETRIS_COLS; i++){
		tetris_ctx.moveTo(i*CELL_SIZE, 0);
		tetris_ctx.lineTo(i*CELL_SIZE, TETRIS_ROWS*CELL_SIZE);
	}
	tetris_ctx.closePath();
	
	tetris_ctx.strokeStyle = "#aaa";
	tetris_ctx.lineWidth = 0.3;
	tetris_ctx.stroke();
}

var initBlock = function(){
	var rand = Math.floor(Math.random()*blockArr.length);
	currentFall = [
			{x:blockArr[rand][0].x, y:blockArr[rand][0].y, color:blockArr[rand][0].color},
			{x:blockArr[rand][1].x, y:blockArr[rand][1].y, color:blockArr[rand][1].color},
			{x:blockArr[rand][2].x, y:blockArr[rand][2].y, color:blockArr[rand][2].color},
			{x:blockArr[rand][3].x, y:blockArr[rand][3].y, color:blockArr[rand][3].color},
	];
};

var moveDown = function(){
	var canDown = true;
	for(var i=0; i<currentFall.length; i++){
		if(currentFall[i].y >= TETRIS_ROWS-1){
			canDown = false;
			break;
		}
		if(tetris_status[currentFall[i].y+1][currentFall[i].x] != NO_BLOCK){
			canDown = false;
			break;
		}
	}
	if(canDown){
		for(var i=0; i<currentFall.length; i++){
			var cur = currentFall[i];
			tetris_ctx.fillStyle = "white";
			tetris_ctx.fillRect(cur.x*CELL_SIZE+1, cur.y*CELL_SIZE+1, CELL_SIZE-2, CELL_SIZE-2);
		}
		for(var i=0; i<currentFall.length; i++){
			var cur = currentFall[i];
			cur.y++;
		}
		for(var i=0; i<currentFall.length; i++){
			var cur = currentFall[i];
			tetris_ctx.fillStyle = colors[cur.color];
			tetris_ctx.fillRect(cur.x*CELL_SIZE+1, cur.y*CELL_SIZE+1, CELL_SIZE-2, CELL_SIZE-2);
		}
	}else{
		for(var i=0; i<currentFall.length; i++){
			var cur = currentFall[i];
			if(cur.y < 2){
				localStorage.removeItem("curScore");
				localStorage.removeItem("tetris_status");
				localStorage.removeItem("curSpeed");
				if(confirm("您已经输了！是否参与排名？")){
					maxScore = localStorage.getItem("maxScore");
					maxScore = maxScore==null ? 0 : maxScore;
					if(curScore >= maxScore){
						localStorage.setItem("maxScore", curScore);
					}
				}
				isPlaying = false;
				clearInterval(curTimer);
				return;
			}
			tetris_status[cur.y][cur.x] = cur.color;
		}
		lineFull();
		localStorage.setItem("tetris_status", JSON.stringify(tetris_status));
		initBlock();
	}
}

var lineFull = function(){
	for(var i=0; i<TETRIS_ROWS; i++){
		var flag = true;
		for(var j=0; j<TETRIS_COLS; j++){
			if(tetris_status[i][j] == NO_BLOCK){
				flag = false;
				break;
			}
		}
		if(flag){
			curScoreEle.innerHTML = curScore+=100;
			localStorage.setItem("curScore", curScore);
			if(curScore >= curSpeed*curSpeed*500){
				curSpeedEle.innerHTML = curSpeed+=1;
				localStorage.setItem("curSpeed", curSpeed);
				clearInterval(curTimer);
				curTimer = setInterval("moveDown()", 500/curSpeed);
			}
			for(var k=i; k>0; k--){
				for(var l=0; l<TETRIS_COLS; l++){
					tetris_status[k][l] = tetris_status[k-1][l];
				}
			}
			drawBlock();
		}
	}
}

var drawBlock = function(){
	for(var i=0; i<TETRIS_ROWS; i++){
		for(var j=0; j<TETRIS_COLS; j++){
			if(tetris_status[i][j] != NO_BLOCK){
				tetris_ctx.fillStyle = colors[tetris_status[i][j]];
				tetris_ctx.fillRect(j*CELL_SIZE+1, i*CELL_SIZE+1, CELL_SIZE-1, CELL_SIZE-2);
			}else{
				tetris_ctx.fillStyle = "white";
				tetris_ctx.fillRect(j*CELL_SIZE+1, i*CELL_SIZE+1, CELL_SIZE-1, CELL_SIZE-2);
			}
		}
	}
}

onkeydown = function(evt){
	switch(evt.keyCode){
	case 40:
		if(!isPlaying) return;
		moveDown();
		break;
	case 37:
		if(!isPlaying) return;
		moveLeft();
		break;
	case 39:
		if(!isPlaying) return;
		moveRight();
		break;
	case 38:
		if(!isPlaying) return;
		rotate();
		break;
	}
}

var moveLeft = function(){
	var canLeft = true;
	for(var i=0; i<currentFall.length; i++){
		if(currentFall[i].x <= 0){
			canLeft = false;
			break;
		}
		if(tetris_status[currentFall[i].y][currentFall[i].x-1] != NO_BLOCK){
			canLeft = false;
			break;
		}
	}
	if(canLeft){
		for(var i=0; i<currentFall.length; i++){
			var cur = currentFall[i];
			tetris_ctx.fillStyle = "white";
			tetris_ctx.fillRect(cur.x*CELL_SIZE+1, cur.y*CELL_SIZE+1, CELL_SIZE-2, CELL_SIZE-2);
		}
		for(var i=0; i<currentFall.length; i++){
			var cur = currentFall[i];
			cur.x--;
		}
		for(var i=0; i<currentFall.length; i++){
			var cur = currentFall[i];
			tetris_ctx.fillStyle = colors[cur.color];
			tetris_ctx.fillRect(cur.x*CELL_SIZE+1, cur.y*CELL_SIZE+1, CELL_SIZE-2, CELL_SIZE-2);
		}
	}
}

var moveRight = function(){
	var canRight = true;
	for(var i=0; i<currentFall.length; i++){
		if(currentFall[i].x >= TETRIS_COLS-1){
			canRight = false;
			break;
		}
		if(tetris_status[currentFall[i].y][currentFall[i].x+1] != NO_BLOCK){
			canRight = false;
			break;
		}
	}
	if(canRight){
		for(var i=0; i<currentFall.length; i++){
			var cur = currentFall[i];
			tetris_ctx.fillStyle = "white";
			tetris_ctx.fillRect(cur.x*CELL_SIZE+1, cur.y*CELL_SIZE+1, CELL_SIZE-2, CELL_SIZE-2);
		}
		for(var i=0; i<currentFall.length; i++){
			var cur = currentFall[i];
			cur.x++;
		}
		for(var i=0; i<currentFall.length; i++){
			var cur = currentFall[i];
			tetris_ctx.fillStyle = colors[cur.color];
			tetris_ctx.fillRect(cur.x*CELL_SIZE+1, cur.y*CELL_SIZE+1, CELL_SIZE-2, CELL_SIZE-2);
		}
	}
}

var rotate = function(){
	var canRotate = true;
	for(var i=0; i<currentFall.length; i++){
		var preX = currentFall[i].x;
		var preY = currentFall[i].y;
		if(i != 2){
			var afterRotateX = currentFall[2].x + preY -currentFall[2].y;
			var afterRotateY = currentFall[2].y + currentFall[2].x - preX;
			if(tetris_status[afterRotateY][afterRotateX+1] != NO_BLOCK){
				canRotate = false;
				break;
			}
			
			if(afterRotateX < 0 || tetris_status[afterRotateY-1][afterRotateX] != NO_BLOCK){
				moveRight();
				aferRotateX = currentFall[2].x + preY - currentFall[2].y;
				afterRotateY = currentFall[2].y + currentFall[2].x - preX;
				break;
			}
			if(afterRotateX < 0 || tetris_status[afterRotateY-1][afterRotateX] != NO_BLOCK){
				moveRight();
				break;
			}
			
			if(afterRotateX >= TETRIS_COLS-1 || tetris_status[afterRotateY][afterRotateX+1] != NO_BLOCK){
				moveLeft();
				aferRotateX = currentFall[2].x + preY - currentFall[2].y;
				afterRotateY = currentFall[2].y + currentFall[2].x - preX;
				break;
			}
			if(afterRotateX >= TETRIS_COLS-1 || tetris_status[afterRotateY-1][afterRotateX] != NO_BLOCK){
				moveRight();
				break;
			}
		}
	}
	if(canRotate){
		for(var i=0; i<currentFall.length; i++){
			var cur = currentFall[i];
			tetris_ctx.fillStyle = "white";
			tetris_ctx.fillRect(cur.x*CELL_SIZE+1, cur.y*CELL_SIZE+1, CELL_SIZE-2, CELL_SIZE-2);
		}
		for(var i=0; i<currentFall.length; i++){
			var preX = currentFall[i].x;
			var preY = currentFall[i].y;
			if(i != 2){
				currentFall[i].x = currentFall[2].x + preY - currentFall[2].y;
				currentFall[i].y = currentFall[2].y + currentFall[2].x - preX;
			}
		}
		for(var i=0; i<currentFall.length; i++){
			var cur = currentFall[i];
			tetris_ctx.fillStyle = colors[cur.color];
			tetris_ctx.fillRect(cur.x*CELL_SIZE+1, cur.y*CELL_SIZE+1, CELL_SIZE-2, CELL_SIZE-2);
		}
	}
}

var isStop = function(){
	var stopBtn = document.getElementById("stop");
	if(isPlaying == true){
		isPlaying = false;
		clearInterval(curTimer);
		stopBtn.setAttribute("value","继续");
	}else{
		isPlaying = true;
		curTimer = setInterval("moveDown()", 500/curSpeed);
		stopBtn.setAttribute("value","暂停")
	}
}

var reStart = function(){
	if(confirm("确定要放弃本局重新开始吗？")){
		location.reload();
	}
}

var TETRIS_ROWS = 18;
var TETRIS_COLS = 12;
var CELL_SIZE = 28;
var CELL_SIZE = 28;
var NO_BLOCK = 0;
var isPlaying = true;
var colors = ["green", "yellow", "red", "blue", "gray", "orange", "pink"];

var tetris_status = [];
for(var i=0; i<TETRIS_ROWS; i++){
	tetris_status[i] = [];
	for(var j=0; j<TETRIS_COLS; j++){
		tetris_status[i][j] = NO_BLOCK;
	}
}

var blockArr = [
        //Z
    	[
    	 	{x:TETRIS_COLS/2-1, y:0, color:1},
    	 	{x:TETRIS_COLS/2, y:0, color:1},
    	 	{x:TETRIS_COLS/2, y:1, color:1},
    	 	{x:TETRIS_COLS/2+1, y:1, color:1}
    	 ],
    	//反Z
    	[
    	 	{x:TETRIS_COLS/2+1, y:0, color:2},
    	 	{x:TETRIS_COLS/2, y:0, color:2},
    	 	{x:TETRIS_COLS/2, y:1, color:2},
    	 	{x:TETRIS_COLS/2-1, y:1, color:2}
    	 ],
    	//田
    	[
    	 	{x:TETRIS_COLS/2-1, y:0, color:3},
    	 	{x:TETRIS_COLS/2, y:0, color:3},
    	 	{x:TETRIS_COLS/2-1, y:1, color:3},
    	 	{x:TETRIS_COLS/2, y:1, color:3}
    	 ],
    	//L
    	[
    	 	{x:TETRIS_COLS/2-1, y:0, color:4},
    	 	{x:TETRIS_COLS/2-1, y:1, color:4},
    	 	{x:TETRIS_COLS/2-1, y:2, color:4},
    	 	{x:TETRIS_COLS/2, y:2, color:4}
    	 ],
    	//J
    	[
    	 	{x:TETRIS_COLS/2, y:0, color:5},
    	 	{x:TETRIS_COLS/2, y:1, color:5},
    	 	{x:TETRIS_COLS/2, y:2, color:5},
    	 	{x:TETRIS_COLS/2-1, y:2, color:5}
    	 ],
    	//I
    	[
    	 	{x:TETRIS_COLS/2, y:0, color:6},
    	 	{x:TETRIS_COLS/2, y:1, color:6},
    	 	{x:TETRIS_COLS/2, y:2, color:6},
    	 	{x:TETRIS_COLS/2, y:3, color:6}
    	 ],
    	//⊥
    	[
    	 	{x:TETRIS_COLS/2, y:0, color:0},
    	 	{x:TETRIS_COLS/2-1, y:1, color:0},
    	 	{x:TETRIS_COLS/2, y:1, color:0},
    	 	{x:TETRIS_COLS/2+1, y:1, color:0}
    	 ]
    ];

createCanvas(TETRIS_ROWS, TETRIS_COLS, CELL_SIZE, CELL_SIZE);
document.getElementById("gameArea").appendChild(tetris_canvas);
curScoreEle = document.getElementById("curScoreEle");
curSpeedEle = document.getElementById("curSpeedEle");
maxScoreEle = document.getElementById("maxScoreEle");

var tmpStatus = localStorage.getItem("tetris_status");
tetris_status = tmpStatus==null ? tetris_status : JSON.parse(tmpStatus);
drawBlock();

curScore = localStorage.getItem("curScore");
curScore = curScore==null ? 0 : parseInt(curScore);
curScoreEle.innerHTML = curScore;

maxScore = localStorage.getItem("maxScore");
maxScore = maxScore==null ? 0 : parseInt(maxScore);
maxScoreEle.innerHTML = maxScore;

curSpeed = localStorage.getItem("curSpeed");
curSpeed = curSpeed==null ? 1 : parseInt(curSpeed);
curSpeedEle.innerHTML = curSpeed;

initBlock();
curTimer = setInterval("moveDown()", 500/curSpeed);
