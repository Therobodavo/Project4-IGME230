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
			allShapes.push({x:e.offsetX,y:e.offsetY,type:"square",color:'red'});
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
		ctx.fillRect(0,0,600,500);
		
		ctx.fillStyle = 'black';
		ctx.beginPath();
		ctx.moveTo(0,100);
		ctx.lineTo(600,100);
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
		for(let i = 0; i < allShapes.length; i++)
		{
			allShapes[i].y += 2;
		}
	}
	function drawRect(x,y,color)
	{
		ctx.fillStyle = color;
		ctx.fillRect(x,y,50,50);
	}