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
let idNum = 0;

//Creates first color and shape
let nextColor;
let nextShape;

//Sets first color
randomizeColor();

//Sets first shape
randomizeShape();

function randomizeColor()
{
	nextColor = Math.round(Math.random() * 4);
	if(nextColor === 0 || nextColor === 4)
	{
		nextColor = 'red';
	}
	else if(nextColor === 1)
	{
		nextColor = 'green';
	}
	else if(nextColor === 2)
	{
		nextColor = 'blue';
	}
	else if(nextColor === 3)
	{
		nextColor = 'orange';
	}
}
function randomizeShape()
{
	nextShape = Math.round(Math.random() * 3);
	if(nextShape === 0 || nextShape === 3)
	{
		nextShape = "square";
	}
	else if(nextShape === 1)
	{
		nextShape = "triangle";
	}
	else if(nextShape === 2)
	{
		nextShape = "circle";
	}
}

canvas.addEventListener('mousemove',function(e)
{
	mouseX = e.offsetX;
	mouseY = e.offsetY;
},false)

canvas.addEventListener('click',function(e)
{
	if(canClick && !filled)
	{
		//add shape locations to list
		allShapes.push({x:Math.floor(e.offsetX/50) * 50,y:100,type:nextType,color:nextColor,id:idNum,canMove:true});
		idNum++;
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

	//Draws shapes
	for(let i = 0; i < allShapes.length; i++)
	{
		if(allShapes[i].type === "square")
		{
			drawRect(allShapes[i].x,allShapes[i].y,allShapes[i].color);
		}
		else if(allShapes[i].type === "triangle")
		{
			drawTri(allShapes[i].x,allShapes[i].y,allShapes[i].color);
		}
		else if(allShapes[i].type === "circle")
		{
			drawCir(allShapes[i].x,allShapes[i].y,allShapes[i].color);
		}
	}
}
function update()
{
	time++;
	if(time - lastClick >= clickDelay)
	{
		canClick = true;
	}

	let resetLoop = false;
	for(let i = 0; i < allShapes.length;i++)
	{
		let canMoveDown = true;
		let tempYTop = allShapes[i].y + 2;
		let tempYBottom = allShapes[i].y + 52;

		//If one and two spots away there is a match
		let oneAway = -1;
		let twoAway = -1;
		for(let j = 0; j < allShapes.length; j++)
		{
			if(allShapes[i].x < allShapes[j].x + 50 &&
			   allShapes[i].x + 50 > allShapes[j].x &&
			   tempYTop < allShapes[j].y + 50 &&
			   tempYBottom > allShapes[j].y &&
			   allShapes[i] != allShapes[j]
			   || allShapes[i].y + 50 >= canvas.height)
			{
				allShapes[i].canMove = false;
			}
			else
			{
				allShapes[i].canMove = true;
			}
			if(!allShapes[i].canMove)
			{
				if(allShapes[i].y + 51 === allShapes[j].y - 1)
				{
					allShapes[i].y += 1;
				}
				if(allShapes[i].y <= 105)
				{
					filled = true;
				}
				break;
			}
		}
		if(allShapes[i].canMove && allShapes[i].y + 52 <= canvas.height)
		{
			allShapes[i].y += 2;
			if(allShapes[i].y + 50 === canvas.height)
			{
				allShapes[i].canMove = false;
			}
		}
		else if(allShapes[i].y  + 50 > canvas.height)
		{
			allShapes[i].y = canvas.height - 50;
			allShapes[i].canMove = false;
		}
	}

	//collision removal detection

	//Goes through each shape
	for(let i = 0; i < allShapes.length; i++)
	{
		//Goes through each shape again, being compared to the first loops shape
		for(let j = 0; j < allShapes.length; j++)
		{
			//Checks the 2 shapes are the same type of shape and color
			if(allShapes[i].type === allShapes[j].type && allShapes[i].color === allShapes[j].color && allShapes[j].canMove === false && allShapes[i].canMove === false)
			{
				//Vertical checking

				//if both shapes have the same x, and they are within 50 pixels in the y
				if(allShapes[i].x === allShapes[j].x && allShapes[i].y - allShapes[j].y > 45 && allShapes[i].y - allShapes[j].y < 55)
				{
					oneAway = allShapes[j].id;
					for(let s = 0; s < allShapes.length; s++)
					{
						if(!allShapes[s].canMove)
						{
							if(allShapes[i].type === allShapes[s].type && allShapes[s].color === allShapes[i].color)
							{
								if(allShapes[j].x === allShapes[s].x && allShapes[j].y - allShapes[s].y > 45 && allShapes[j].y - allShapes[s].y < 55)
								{
									twoAway = allShapes[s].id;
									for(let b = allShapes.length - 1; b >= 0; b--)
									{
										if(b === i)
										{
											allShapes.splice(i,1);
										}
										else if(b === j)
										{
											allShapes.splice(j,1);
										}
										else if(b === s)
										{
											allShapes.splice(s,1);
										}
									}
									resetLoop = true;
									break;
								}
							}
						}
					}
					if(resetLoop)
					{
						break;
					}
				}

				//Horizontal Checking
				if(allShapes[i].y - allShapes[j].y >= -1 && allShapes[i].y - allShapes[j].y <= 1 && allShapes[i].x - allShapes[j].x > 45 && allShapes[i].x - allShapes[j].x < 55)
				{
					oneAway = allShapes[j].id;
					for(let s = 0; s < allShapes.length; s++)
					{
						if(!allShapes[s].canMove)
						{
							if(allShapes[j].type === allShapes[s].type && allShapes[j].color === allShapes[s].color)
							{
								if(allShapes[j].y - allShapes[s].y >= -1 && allShapes[j].y - allShapes[s].y <= 1 && allShapes[j].x - allShapes[s].x > 45 && allShapes[j].x - allShapes[s].x < 55)
								{
									twoAway = allShapes[s].id;
									for(let b = allShapes.length - 1; b >= 0; b--)
									{
										if(b === i)
										{
											allShapes.splice(i,1);
										}
										else if(b === j)
										{
											allShapes.splice(j,1);
										}
										else if(b === s)
										{
											allShapes.splice(s,1);
										}
									}
									resetLoop = true;
									break;
								}
							}
						}
					}
					if(resetLoop)
					{
						break;
					}
				}

				//Diagonal Left-Up Checking
				if(allShapes[i].y - allShapes[j].y >= 45 && allShapes[i].y - allShapes[j].y <= 55 && allShapes[i].x - allShapes[j].x > 45 && allShapes[i].x - allShapes[j].x < 55)
				{
					oneAway = allShapes[j].id;
					for(let s = 0; s < allShapes.length; s++)
					{
						if(!allShapes[s].canMove)
						{
							if(allShapes[j].type === allShapes[s].type && allShapes[j].color === allShapes[s].color)
							{
								if(allShapes[j].y - allShapes[s].y >= 45 && allShapes[j].y - allShapes[s].y <= 55 && allShapes[j].x - allShapes[s].x > 45 && allShapes[j].x - allShapes[s].x < 55)
								{
									twoAway = allShapes[s].id;
									for(let b = allShapes.length - 1; b >= 0; b--)
									{
										if(b === i)
										{
											allShapes.splice(i,1);
										}
										else if(b === j)
										{
											allShapes.splice(j,1);
										}
										else if(b === s)
										{
											allShapes.splice(s,1);
										}
									}
									resetLoop = true;
									break;
								}
							}
						}
					}
					if(resetLoop)
					{
						break;
					}
				}

				//Diagonal Right-Up Checking
				if(allShapes[i].y - allShapes[j].y >= 45 && allShapes[i].y - allShapes[j].y <= 55 && allShapes[j].x - allShapes[i].x > 45 && allShapes[j].x - allShapes[i].x < 55)
				{
					oneAway = allShapes[j].id;
					for(let s = 0; s < allShapes.length; s++)
					{
						if(!allShapes[s].canMove)
						{
							if(allShapes[j].type === allShapes[s].type && allShapes[j].color === allShapes[s].color)
							{
								if(allShapes[j].y - allShapes[s].y >= 45 && allShapes[j].y - allShapes[s].y <= 55 && allShapes[s].x - allShapes[j].x > 45 && allShapes[s].x - allShapes[j].x < 55)
								{
									twoAway = allShapes[s].id;
									for(let b = allShapes.length - 1; b >= 0; b--)
									{
										if(b === i)
										{
											allShapes.splice(i,1);
										}
										else if(b === j)
										{
											allShapes.splice(j,1);
										}
										else if(b === s)
										{
											allShapes.splice(s,1);
										}
									}
									resetLoop = true;
									break;
								}
							}
						}
					}
					if(resetLoop)
					{
						break;
					}
				}
			}
		}
		if(resetLoop)
		{
			break;
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
function drawTri(x,y,color)
{
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.moveTo(x + 25,y);
	ctx.lineTo(x + 50,y + 50);
	ctx.lineTo(x,y + 50);
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
}
function drawCir(x,y,color)
{
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(x + 25, y + 25,25,0,2 * Math.PI,false);
	ctx.fill();
	ctx.fillStyle = 'black';
	ctx.stroke();
}