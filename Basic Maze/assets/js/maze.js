window.onload = function() {
	var $ = function(id) {
		return document.getElementById(id);
	};
	var dc = function(tag){
		return document.createElement(tag);
	};

	//Map
	var map=[
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,1,0,0,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,0,0,1,1,1,1,1,1,0,0,1,1],
		[1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
		[1,1,1,1,0,0,1,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,1,0,0,1,0,0,1,1,0,0,1],
		[1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,1,0,0,1],
		[1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,1,0,0,1],
		[1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,1,1,0,0,1,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,1,0,0,1,0,0,1],
		[1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,0,1,0,0,1,0,0,1],
		[1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1],
		[1,0,0,1,0,0,0,1,1,1,1,1,1,1,0,0,1,0,0,1,1,1,0,0,1,1,1,0,0,1,0,0,1],
		[1,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,1,0,0,1,0,0,1],
		[1,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1],
		[1,0,0,1,1,1,1,1,0,0,1,0,0,1,0,0,1,0,0,0,0,0,1,1,0,0,1,0,0,1,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,1,1,0,0,0,0,1,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
	];

	var player={
		// (x,y) of player
		x:2,
		y:3,
		dir:0,	//direction of player
		rot:89.5,	//angle of rotation
		speed:0,	//speed forward and back
		moveSpeed:0.22,	//how far (in map units) the player moves with each step
		rotSpeed:10*Math.PI/180	//how much a player turns with each step
	}

	var mapWidth=0; //x-direction length
	var mapHeight=0; //y-direction length

	var miniMapScale=8; //pixels drawn per map block

	var screenWidth=1014;
	var screenHeight=638;

	var stripWidth=2;
	var fov=60*Math.PI/180;

	var numRays=Math.ceil(screenWidth/stripWidth);
	var fovHalf=fov/2;

	var viewDist=(screenWidth/2)/Math.tan((fov/2));

	var twoPI=Math.PI*2;

	var numTextures=4;

	function init(){
		mapWidth=map[0].length;
		mapHeight=map.length;
		bindKeys();
		initScreen();
		drawMiniMap();
		gameCycle();
	}

	var screenStrips = [];

	function initScreen(){
		var screen = $("mazeScreen");

		for (var i=0;i<screenWidth;i+=stripWidth) {
			var strip = dc("div");
			strip.style.position = "absolute";
			strip.style.left = i + "px";
			strip.style.width = stripWidth+"px";
			strip.style.height = "0px";
			strip.style.overflow = "hidden";

			strip.style.backgroundColor = "magenta";

			var img = new Image();
			img.src = "assets/images/wall.png";
			img.style.position = "absolute";
			img.style.left = "0px";

			strip.appendChild(img);
			strip.img = img;	// assign the image to a property on the strip element so we have easy access to the image later

			screenStrips.push(strip);
			mazeScreen.appendChild(strip);
		}

	}

	function bindKeys(){
		document.onkeydown=function(e){
			e=e||window.event;
			switch(e.keyCode){
				case 38:
					player.speed=1;
					break;
				case 40:
					player.speed=-1;
					break;
				case 37:
					player.dir=-1;
					break;
				case 39:
					player.dir=1;
					break;
			}
		}
		document.onkeyup=function(e){
			e=e||window.event;
			switch(e.keyCode){
				case 38:
				case 40:
					player.speed=0;
					break;
				case 37:
				case 39:
					player.dir=0;
					break;
			}
		}
	}

	function gameCycle(){
		move();
		updateMiniMap();
		castRays();
		setTimeout(gameCycle,1000/30);  //30 FPS
	}

	function castRays(){
		var stripIdx=0;

		for (var i=0;i<numRays;i++){
			//where on the screen the ray goes through
			var rayScreenPos=(-numRays/2+i)*stripWidth;

			//distance from the viewer to the point on screen (Pythagoras)
			var rayViewDist=Math.sqrt(rayScreenPos*rayScreenPos+viewDist*viewDist);

			//the angle of the ray relative to the viewing direction
			//right triangle: a=sin(A)*c
			var rayAngle=Math.asin(rayScreenPos/rayViewDist);
			castSingleRay(
				player.rot+rayAngle,
				stripIdx++
			);
		}
	}

	function castSingleRay(rayAngle, stripIdx){
		//make sure the angle is between 0 and 360
		rayAngle%=twoPI;
		if(rayAngle<0)rayAngle+=twoPI;

		//determine quadrant for movement
		var right=(rayAngle>twoPI*.75 || rayAngle<twoPI*.25);
		var up=(rayAngle<0 || rayAngle>Math.PI);

		var wallType=0;

		//do these only once
		var angleSin=Math.sin(rayAngle), 
			angleCos=Math.cos(rayAngle);

		var dist=0;	//distance to the block hit
		//x and y of ray hitting block
		var xHit=0,
			yHit=0;
		var textureX;	//x-coord on the texture of the block
		//(x,y) mpacoords of the block
		var wallX;	
		var wallY;

		var wallIsHorizontal=false;

		// first check against the vertical map/wall lines
		// we do this by moving to the right or left edge of the block we're standing in
		// and then moving in 1 map unit steps horizontally. The amount we have to move vertically
		// is determined by the slope of the ray, which is simply defined as sin(angle) / cos(angle).

		var slope=angleSin/angleCos; //the slope of the straight line made by the ray
		var dXVer=right?1:-1;	//move either 1 left or 1 right
		var dYVer=dXVer*slope;	//how much to move up or down

		var x=right?Math.ceil(player.x):Math.floor(player.x);	//starting horizontal position
		var y=player.y+(x-player.x)*slope;	//starting vertical position

		while(x>=0 && x<mapWidth && y>=0 && y<mapHeight){
			var wallX=Math.floor(x+(right?0:-1));
			var wallY=Math.floor(y);

			//is this point inside a wall
			if (map[wallY][wallX]>0){
				var distX=x-player.x;
				var distY=y-player.y;
				dist=distX*distX+distY*distY; //the distance the player to this point squared

				wallType=map[wallY][wallX];
				textureX=y%1;
				if(!right) textureX=1-textureX;

				xHit=x;
				yHit=y;

				wallIsHorizontal=true;

				break;
			}
			x+=dXVer;
			y+=dYVer;
		}

		// now check against horizontal lines. It's basically the same, just "turned around".
		// the only difference here is that once we hit a map block,
		// we check if there we also found one in the earlier, vertical run. We'll know that if dist != 0.
		// If so, we only register this hit if this distance is smaller.
		var slope = angleCos / angleSin;
		var dYHor = up ? -1 : 1;
		var dXHor = dYHor * slope;
		var y = up ? Math.floor(player.y) : Math.ceil(player.y);
		var x = player.x + (y - player.y) * slope;

		while (x >= 0 && x < mapWidth && y >= 0 && y < mapHeight) {
			var wallY = Math.floor(y + (up ? -1 : 0));
			var wallX = Math.floor(x);

			if (map[wallY][wallX] > 0) {
				var distX = x - player.x;
				var distY = y - player.y;
				var blockDist = distX*distX + distY*distY;

				if (!dist || blockDist < dist) {
					dist = blockDist;
					
					xHit = x;
					yHit = y;

					wallType = map[wallY][wallX];
					textureX = x % 1;
					if (up) textureX = 1 - textureX;
				}
				break;
			}
			x += dXHor;
			y += dYHor;
		}

		if(dist){
			//drawRay(xHit, yHit);
			var strip = screenStrips[stripIdx];

			dist = Math.sqrt(dist);

			// use perpendicular distance to adjust for fish eye
			// distorted_dist = correct_dist / cos(relative_angle_of_ray)
			dist = dist * Math.cos(player.rot - rayAngle);

			// now calc the position, height and width of the wall strip

			// "real" wall height in the game world is 1 unit, the distance from the player to the screen is viewDist,
			// thus the height on the screen is equal to wall_height_real * viewDist / dist

			var height = Math.round(viewDist / dist);

			// width is the same, but we have to stretch the texture to a factor of stripWidth to make it fill the strip correctly
			var width = height * stripWidth;

			// top placement is easy since everything is centered on the x-axis, so we simply move
			// it half way down the screen and then half the wall height back up.
			var top = Math.round((screenHeight - height) / 2);

			strip.style.height = height+"px";
			strip.style.top = top+"px";

			strip.img.style.height = Math.floor(height * numTextures) + "px";
			strip.img.style.width = Math.floor(width*2) +"px";
			strip.img.style.top = -Math.floor(height * (wallType-1)) + "px";

			var texX = Math.round(textureX*width);

			if (texX > width - stripWidth)
				texX = width - stripWidth;

			strip.img.style.left = -texX + "px";
		}
	}

	function drawRay(rayX, rayY){
		var miniMapObjects=$("Canvas1Objects");
		var objectCtx=miniMapObjects.getContext("2d");

		objectCtx.strokeStyle="rgba(0,100,0,.3)";
		objectCtx.lineWidth=.5;
		objectCtx.beginPath();
		objectCtx.moveTo(player.x*miniMapScale, player.y*miniMapScale);
		objectCtx.lineTo(rayX*miniMapScale, rayY*miniMapScale);
		objectCtx.closePath();
		objectCtx.stroke();
	}

	function move(){
		var moveStep=player.speed*player.moveSpeed;	//player will move this far along current direction
		player.rot+=player.dir*player.rotSpeed;	//add rotation if player is rotating
		
		//make sure the angle is between 0 and 360
		while(player.rot<0)player.rot+=twoPI;
		while(player.rot>=twoPI)player.rot-=twoPI;

		//Calculate new position with trig
		var newX=player.x+Math.cos(player.rot)*moveStep;
		var newY=player.y+Math.sin(player.rot)*moveStep;
		
		if(isBlocking(newX, newY)){
			return;	// If player can't move to position stop
		}

		//Set new position
		player.x=newX;
		player.y=newY;
	}

	function isBlocking(x,y){
		//don't move outside the boundaries
		if(y<0 || y>=mapHeight || x<0 || x>=mapWidth)
			return true;
			//return true if the map block is not 0
		return (map[Math.floor(y)][Math.floor(x)] != 0);
	}

	function updateMiniMap(){
		var miniMap=$("Canvas1");
		var miniMapObjects=$("Canvas1Objects");

		var objectCtx=miniMapObjects.getContext("2d");
		miniMapObjects.width=miniMapObjects.width;

		objectCtx.fillStyle="red";
		objectCtx.fillRect(
			player.x*miniMapScale-2,
			player.y*miniMapScale-2,
			4,
			4
		);
		objectCtx.strokeStyle="red";
		objectCtx.beginPath();
		objectCtx.moveTo(player.x*miniMapScale, player.y*miniMapScale);
		objectCtx.lineTo(
			(player.x+Math.cos(player.rot)*4)*miniMapScale,
			(player.y+Math.sin(player.rot)*4)*miniMapScale
		);
		objectCtx.closePath();
		objectCtx.stroke();
	}

	function drawMiniMap(){	
		//draw the topdown view minimap
		var miniMap=$("Canvas1");
		var maze=$("maze");
		var miniMapObjects=$("Canvas1Objects");

		miniMap.width=mapWidth*miniMapScale;
		miniMap.height=mapHeight*miniMapScale;
		miniMapObjects.width=miniMap.width;
		miniMapObjects.height=miniMap.height;

		var w=(mapWidth*miniMapScale)+"px";
		var h=(mapHeight*miniMapScale)+"px";
		miniMap.style.width=miniMapObjects.style.width=maze.style.width=w;
		miniMap.style.height=miniMapObjects.style.height=maze.style.height=h;

		if (miniMap && miniMap.getContext) {
			var ctx = miniMap.getContext("2d");
			
			if (ctx) {
				ctx.fillStyle="white";
				ctx.fillRect(0,0,miniMap.width,miniMap.height);

				for (var y=0;y<mapHeight;y++){
					for(var x=0;x<mapWidth;x++){
						var wall=map[y][x];
						if (wall>0){
							ctx.fillStyle="rgb(200,200,200)";
							ctx.fillRect(
								x*miniMapScale,
								y*miniMapScale,
								miniMapScale,
								miniMapScale
							);
						}
					}
				}
			}
		}
		updateMiniMap();
	}
	setTimeout(init,1);
}