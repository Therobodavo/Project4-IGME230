	let canvas = document.getElementById('main');
	let ctx = canvas.getContext('2d');
	canvas.width = '800';
	canvas.height = '1000';
	let allShapes = [];
	let clickDelay = 60;
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
		ctx.fillRect(0,0,800,1000);
		
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
		ctx.fillRect(x,y,100,100);
	}