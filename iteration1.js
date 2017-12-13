	let canvas = document.getElementById('main');
	let ctx = canvas.getContext('2d');
	canvas.width = '600';
	canvas.height = '500';
	let allShapes = [];
	let clickDelay = 30;
	let lastClick = 0;
	let time = 0;
	let canClick = true;
	
	canvas.addEventListener('click',function(e)
	{
		if(canClick)
		{
			//add shape locations to list
			allShapes.push({x:Math.floor(e.offsetX/50) * 50,y:100,type:"square",color:'red'});
			canClick = false;
			lastClick = time;
		}
	},false);
	
	var FPS = 30;
	
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
		if(canClick)
		{
			ctx.fillStyle = '#96df96';
		}
		else
		{
			ctx.fillStyle = '#df7866'
		}
		
		ctx.fillRect(0,0,canvas.width,100);
		ctx.fillStyle = 'black';
		ctx.beginPath();
		ctx.moveTo(0,100);
		ctx.lineTo(canvas.width,100);
		ctx.stroke();

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
					break;
				}
				else if(!canMoveDown)
				{
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