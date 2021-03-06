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
	
	var img=new Image();
	img.src = "cb2.png";
	
	function init() {
			img.onload = function(){
				canvas.width = img.width;
				canvas.height = img.height;
				console.log("img load");
				ctx.drawImage(this,0,0);
			}
			
//			return setInterval(draw, 10);
	}
	

	init();
	var dx=1,dy=1;
	var currentNode = 0;
	
	var vector = function(x,y){
		this.x=x;
		this.y=y;
	}
	
	var $traveler = function(x,y,nodeList,id,ml,mr){
		var domObj = $("<div class='station' id=st_'"+id+"' style='margin-left:"+ml+"px;"+"margin-top:"+mr+"px;"+"'></div>");
		$("#cont").prepend(domObj);
		console.log("sadasd")
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
		
		r.bind("nodeArrived", function(e){
			e.currentTarget.nodeIndex++; 
		});
		
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
	
	var moveTraveler = function($t){
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
				t.positionX++;
			}
			else if(node.x < t.positionX){
				t.positionX--;
			}
			else{
				$t.trigger("nodeArrived");
			}
		}
		if(node.x==t.positionX){
			if(node.y > t.positionY){
				t.positionY++;
			}else if(node.y < t.positionY){
				t.positionY--;
				if(t.positionY==node.y){
					$t.trigger("nodeArrived");
				}
			}
		}
		if(node.x!=t.positionX && node.y!=t.positionY){
			
			if(node.x > t.positionX){
				t.positionX++;
			}
			else if(node.x < t.positionX){
				t.positionX--;
			}
			else{
				$t.trigger("nodeArrived");
			}
			
			if(node.y > t.positionY){
				t.positionY++;
			}else if(node.y < t.positionY){
				t.positionY--;
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
	
	var t8 = new $traveler();
	
	function draw(){
		clear();
		
		ctx.drawImage(img,0,0,canvas.width, canvas.height);

		arc(t[0].positionX,t[0].positionY,4,t[0].opacity);
		arc(t2[0].positionX,t2[0].positionY,4,t2[0].opacity);
		arc(t3[0].positionX,t3[0].positionY,4,t3[0].opacity);
		arc(t4[0].positionX,t4[0].positionY,4,t4[0].opacity);
		arc(t5[0].positionX,t5[0].positionY,4,t5[0].opacity);
		arc(t6[0].positionX,t6[0].positionY,4,t6[0].opacity);
		arc(t7[0].positionX,t7[0].positionY,4,t7[0].opacity);
		
		moveTraveler(t);
		moveTraveler(t2);
		moveTraveler(t3);
		moveTraveler(t4);
		moveTraveler(t5);
		moveTraveler(t6);
	}
	
	//init();
}
