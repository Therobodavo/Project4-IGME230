let canvas = document.getElementById('main');
let ctx = canvas.getContext('2d');
canvas.width = '600';
canvas.height = '500';
let allShapes = [];
let clickDelay = 30;
let lastClick = 0;
let time = 0;
let canClick = true;
var img = new Image();
img.src = "crane.svg";
let mouseX = 0;
let mouseY = 0;
let filled = false;

canvas.addEventListener('mousemove',function(e)
{
	mouseX = e.offsetX;
	mouseY = e.offsetY;
},false)

canvas.addEventListener('click',function(e)
{
	if(canClick && !filled)
	{
		let color = Math.round(Math.random() * 4);
		if(color === 0 || color === 4)
		{
			color = 'red';
		}
		else if(color === 1)
		{
			color = 'green';
		}
		else if(color === 2)
		{
			color = 'blue';
		}
		else if(color === 3)
		{
			color = 'orange';
		}
		//add shape locations to list
		allShapes.push({x:Math.floor(e.offsetX/50) * 50,y:100,type:"square",color:color});
		canClick = false;
		lastClick = time;
	}
},false);
document.querySelector("#btnReset").onclick = function(e)
{
	allShapes = [];
	filled = false;
	time = 0;
	lastClick = 0;
};
var FPS = 60;

setInterval(function()
{
	update();
	draw();
}
, 1000/FPS);

function draw()
{
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.fillStyle = 'gray';
	ctx.fillRect(0,0,canvas.width,canvas.height);

	//Set color for clicking area
	if(canClick && !filled)
	{
		ctx.fillStyle = '#96df96';
	}
	else
	{
		ctx.fillStyle = '#df7866'
	}
	ctx.fillRect(0,0,canvas.width,100);
	ctx.fillStyle = 'black';

	if(filled)
	{
		ctx.font = "25px Arial";
		ctx.textAlign = "center";
		ctx.fillText("AREA FULL",canvas.width / 2,50);
	}
	ctx.beginPath();
	ctx.moveTo(0,100);
	ctx.lineTo(canvas.width,100);
	ctx.stroke();

	//Crane
	ctx.drawImage(img,(Math.floor(mouseX/50) * 50) + 10,85);
	for(let i = 0; i < allShapes.length; i++)
	{
		drawRect(allShapes[i].x,allShapes[i].y,allShapes[i].color);
	}
}
function update()
{
	time++;
	if(time - lastClick >= clickDelay)
	{
		canClick = true;
	}
	for(let i = 0; i < allShapes.length;i++)
	{
		let canMoveDown = true;
		let tempYTop = allShapes[i].y + 2;
		let tempYBottom = allShapes[i].y + 52;
		for(let j = 0; j < allShapes.length; j++)
		{
			if(allShapes[i].x < allShapes[j].x + 50 &&
			   allShapes[i].x + 50 > allShapes[j].x &&
			   tempYTop < allShapes[j].y + 50 &&
			   tempYBottom > allShapes[j].y &&
			   allShapes[i] != allShapes[j])
			{
				canMoveDown = false;
			}
			if(!canMoveDown && allShapes[i].y + 51 === allShapes[j].y - 1)
			{
				allShapes[i].y += 1;
				if(allShapes[i].y <= 105)
				{
					filled = true;
				}
				break;
			}
			else if(!canMoveDown)
			{
				if(allShapes[i].y <= 105)
				{
					filled = true;
				}
				break;
			}
		}
		if(canMoveDown && allShapes[i].y + 52 <= canvas.height)
		{
			allShapes[i].y += 2;
		}
		else if(allShapes[i].y > canvas.height)
		{
			allShapes[i].y = canvas.height - 50;
		}
	}
}
function drawRect(x,y,color)
{
	ctx.fillStyle = color;
	ctx.fillRect(x,y,50,50);
	ctx.fillStyle = 'black';
	ctx.strokeRect(x - 1,y - 1,52,52);
}