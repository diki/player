window.onload=function()
{
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	
	var W_WIDTH = screen.width;
	var W_HEIGHT = screen.height;
	
	canvas.width = W_WIDTH/4;
	canvas.height = W_HEIGHT*0.5;
	
	var container = $("#container");
	container.append(canvas);
	
	//image element
	var img=new Image();
	img.src = "cb2.png";
	
	function init() {
	
			//on image load draw image to canvas
			img.onload = function(){
				canvas.width = img.width;
				canvas.height = img.height;
				console.log("img load");
				ctx.drawImage(this,0,0);
			}
			
			return setInterval(draw, 10);
	}
	
	/*init function here...........*/
	init();
	/*int function here ...........*/
	
	var dx=1,dy=1; //unit of movement for x and y coordinates
	var currentNode = 0;
	
	var vector = function(x,y){
		this.x=x;
		this.y=y;
	}
	
	/*
		* Prepend mask DOM object(s) to tree leafs mouse events (click, hover, touch) of nodes will be watched this way
		* Also returns on object with attributes: xPosition, yPosition, nodes array that point will visit (path),
		* Later this object will be used to draw and animate blue arcs
		* 	x,y: current position
		* 	nodeList: array of vectors of node's path'	
		* 	nodeIndex --index of at which member of nodeList
		* 	initialX and initialY -- initil point
		*		opacity
		*
		* Also this object is binded with important events for current node change and path complete 
	*/
	var $traveler = function(x,y,nodeList,id,marginLeft,marginTop){
	
		//this is init function
		var domObj = $("<div class='station' id=st_'"+id+"' style='left:"+marginLeft+"px;"+"top:"+marginTop+"px;"+"'></div>");
		container.prepend(domObj);
		//up to here
		
		var r = $({
			positionX : x,
			positionY : y,
			nodesOnPath: nodeList,
			nodeIndex: 0,
			initialX: x,
			initialY: y,
			opacity: 1,
			id: "x" || id
		});
		
		//on every node change
		r.bind("nodeArrived", function(e){
			e.currentTarget.nodeIndex++; 
		});
		
		//on path complete
		r.bind("pathComplete", function(e){
			var o = e.currentTarget;
			o.positionX = o.initialX;
			o.positionY = o.initialY;
			o.nodeIndex = 0;
			o.opacity=1;
		});
		
		return r;
	}
	
	var travelers = [];	
	var state="blur";
	
	/**
	 * [moveTraveler description]
	 * @param  {[vector]} $t [path array]
	 * @return {[type]}    [description]
	 */
	var moveTraveler = function($t, velocity){

		//getting [0] because this is jquery object
		var t = $t[0];

		var crr = t.nodeIndex;
		if(crr==t.nodesOnPath.length){
			t.nodeIndex++;
			$t.trigger("pathComplete");
			return;
		}
		
		//opacity
		if(crr>t.nodesOnPath.length-4){
			t.opacity = t.opacity - 0.01;
		}
		var node = t.nodesOnPath[crr];
		
		if(node.y==t.positionY){
			if(node.x > t.positionX){
				t.positionX+=velocity;
			}
			else if(node.x < t.positionX){
				t.positionX-=velocity;
			}
			else{
				$t.trigger("nodeArrived");
			}
		}
		if(node.x==t.positionX){
			if(node.y > t.positionY){
				t.positionY+=velocity;
			}else if(node.y < t.positionY){
				t.position-=velocity;
				if(t.positionY==node.y){
					$t.trigger("nodeArrived");
				}
			}
		}
		if(node.x!=t.positionX && node.y!=t.positionY){
			
			if(node.x > t.positionX){
				t.positionX+=velocity;
			}
			else if(node.x < t.positionX){
				t.positionX-=velocity;
			}
			else{
				$t.trigger("nodeArrived");
			}
			
			if(node.y > t.positionY){
				t.positionY+=velocity;
			}else if(node.y < t.positionY){
				t.positionY-=velocity;
				if(t.positionY==node.y){
					$t.trigger("nodeArrived");
				}
			}
		}
	}
	

	//t.trigger("nodeArrived");

	function clear() {
		  ctx.clearRect(0, 0, canvas.width, canvas.height);
	}
	
	function rect(x,y,w,h,o) {
		  ctx.beginPath();
		  ctx.rect(x,y,w,h);
		  ctx.globalAlpha = o;
		  ctx.fillStyle = "#8ED6FF";
		  ctx.closePath();
		  ctx.fill();
	}
	
	function arc(x,y,r,o){
		ctx.beginPath();
		ctx.globalAlpha = o;
		ctx.arc(x,y,r,2*Math.PI,false);
		ctx.lineWidth = 2;
		ctx.strokeStyle = "#8ED6FF";
		ctx.stroke();
	}
	var p1 = new vector(41,25);
	
	var nl=[];
	var node1 = new vector(90,29);
	var node2 = new vector(90,47);
	var node3 = new vector(164,47);
	var node4 = new vector(219,99);
	var node5 = new vector(250,99);
	var node6 = new vector(250,110);
	var node7 = new vector(339,110);
	var node8 = new vector(350,114);
	var node9 = new vector(356, 128);
	var node10 = new vector(359,184);
	nl.push(node1);
	nl.push(node2);
	nl.push(node3);
	nl.push(node4);
	nl.push(node5);
	nl.push(node6);
	nl.push(node7);
	nl.push(node8);
	nl.push(node9);

	nl.push(node10);
	
	var t = new $traveler(41,29,nl,1,30,24);
	travelers.push(t);
	var nl2=[];
	var nt2_1 = new vector(57,47);
	nl2.push(nt2_1);
	nl2.push(node3);
	nl2.push(node4);
	nl2.push(node5);
	nl2.push(node6);
	nl2.push(node7);
	nl2.push(node8);
	nl2.push(node9);
	nl2.push(node10);
	var t2 = new $traveler(57,54,nl2,2, 54, 55);
	travelers.push(t2);
	
	var nl3 = [];
	nl3.push(new vector(274,63));
	nl3.push(new vector(250,63));
	nl3.push(node5);
	nl3.push(node6);
	nl3.push(node7);
	nl3.push(node8);
	nl3.push(node9);
	nl3.push(node10);
	var t3 = new $traveler(274,55,nl3,3, 271, 47);
	travelers.push(t3);
	
	var nl4 = [];
	nl4.push(new vector(116,80));
	nl4.push(new vector(127,69));
	nl4.push(new vector(186,69));
	nl4.push(node4);
	nl4.push(node5);
	nl4.push(node6);
	nl4.push(node7);
	nl4.push(node8);
	nl4.push(node9);
	nl4.push(node10);
	var t4 = new $traveler(30,80,nl4, 4, 17, 74);
	travelers.push(t4);
	
	var nl5 = [];
	nl5.push(new vector(105,92));
	nl5.push(new vector(127,69));
	nl5.push(new vector(186,69));
	nl5.push(node4);
	nl5.push(node5);
	nl5.push(node6);
	nl5.push(node7);
	nl5.push(node8);
	nl5.push(node9);
	nl5.push(node10);
	var t5 = new $traveler(30,92,nl5, 5, 17, 85);
	
	travelers.push(t5);
	var nl6 = [];
	nl6.push(new vector(93,104));
	nl6.push(new vector(127,69));
	nl6.push(new vector(186,69));
	nl6.push(node4);
	nl6.push(node5);
	nl6.push(node6);
	nl6.push(node7);
	nl6.push(node8);
	nl6.push(node9);
	nl6.push(node10);
	var t6 = new $traveler(30,104,nl6, 6, 17, 97);
	travelers.push(t6);
	
	var nl7 = [];
	var t7 = new $traveler(30, 115, nl7, 7,17, 108);
	travelers.push(t7);
	
	//var t8 = new $traveler();

	console.log("travelers: ", travelers);
	
//	bind click events to mask,
//	they are already id attributed iwth own canvas node

	
	function draw(){
		clear();
		
		//currently drawing image on every cycle 
		//i think a better way could be applied
		ctx.drawImage(img,0,0,canvas.width, canvas.height);
		
		
		//draw arcs for every traveler, travler object managament can be improved dramatically
		//draw new arcs on every cycle
		$.each(travelers, function(idx, el){
			arc(el[0].positionX,el[0].positionY,4,el[0].opacity);
			moveTraveler(el,0.5);
		});
		
	}
	
	//init();
}
