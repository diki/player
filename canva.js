window.onload=function()
{

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    
    var W_WIDTH = screen.width;
    var W_HEIGHT = screen.height;

    $("#cc").css("left", (W_WIDTH-641)/2+"px");
    canvas.width = W_WIDTH/4;
    canvas.height = W_HEIGHT*0.5;
    
    var container = $("#canvasContainer");
    container.append(canvas);
    
    //image element
    var img=new Image();
    img.src = "cb2-transparent.png";
    
    function init() {
    
            //on image load draw image to canvas
            img.onload = function(){
                canvas.width = img.width;
                canvas.height = img.height;
                console.log("img load");
                ctx.drawImage(this,0,0);
            }
            
            return setInterval(draw, 40);
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

    function vectorDistance(v1,v2, cx,cy){
        var r = (v2.y-v1.y) * (v2.y-v1.y)*cy*cy + (v2.x-v1.x) * (v2.x-v1.x)*cx*cx;
        return Math.sqrt(r);
    }
    
    window.currentPlayingPoint = false; //jquery object traveler

    /*
        * Prepend mask DOM object(s) to tree leafs mouse events (click, hover, touch) of nodes will be watched this way
        * Also returns on object with attributes: xPosition, yPosition, nodes array that point will visit (path),
        * Later this object will be used to draw and animate blue arcs
        *   x,y: current position
        *   nodeList: array of vectors of node's path'  
        *   nodeIndex --index of at which member of nodeList
        *   initialX and initialY -- initil point
        *       opacity
        *
        * Also this object is binded with important events for current node change and path complete 
    */
    var $traveler = function(x,y,nodeList,id,marginLeft,marginTop, soundUrl){
    
        //this is init function
        var domObj = $("<div class='station' id=st_'"+id+"' style='left:"+marginLeft+"px;"+"top:"+marginTop+"px;"+"'></div>");
        container.prepend(domObj);
        //up to here
        
        var pathLength = 0;

        for(var i=0; i<nodeList.length; i++){
            if(nodeList[i+1]!==undefined){
                pathLength += vectorDistance(nodeList[i], nodeList[i+1], 1,1);
            }
        }

        //calculate velocity default:1
        var velocity = 0;
        // if(sound!==undefined){
        //     velocity = pathLength/sound.duration*40;
        //     console.log("duraiton",velocity);
        // }
        var r = $({
            positionX : x,
            positionY : y,
            nodesOnPath: nodeList,
            nodeIndex: 0,
            initialX: x,
            initialY: y,
            opacity: 1,
            id: id,
            velocity: velocity,
            pathLength: Math.ceil(pathLength),
            sound: undefined
        });

        var self = r[0];

        domObj.click(function(){

            //current status -- sound loaded?
            if(self.sound!==undefined){

                if(self.sound.readyState===3){
                    if(self.sound.playState==1){ //if playing
                        self.sound.stop();
                        //and move circle to start point
                        window.currentPlayingPoint = false;
                        r.trigger("pathComplete");
                        r.trigger("stop");
                    } else {

                        console.log(window.currentPlayingPoint, "on sound loaded");
                        window.currentPlayingPoint.trigger("pathComplete");
                        window.currentPlayingPoint.trigger("stop");

                        window.currentPlayingPoint = r;
                        self.sound.play();
                    }
                } 
            } else {
                console.log("sound loading for the first time")
                if(soundUrl!==undefined){
                    self.sound = soundManager.createSound({
                          id: r[0].id,
                          url: soundUrl,
                          autoLoad: true,
                          //autoPlay: false,
                          onload: function() {
                            console.log('The sound '+this.sID+' loaded!');
                            
                            //var t = new $traveler(41,29,nl,1,30,24,sampleSound);

                            //set velocity
                            r[0].velocity = r[0].pathLength/this.duration*40;
                            
                            //set currentPlayingPoint
                            if(window.currentPlayingPoint){
                                //currentPlayingPoint.trigger("reset");
                                window.currentPlayingPoint.trigger("pathComplete");
                                window.currentPlayingPoint.trigger("stop");                                
                                console.log("active playing sound", window.currentPlayingPoint, r[0]);
                            }else {
                                
                            }

                            window.currentPlayingPoint = r;
                            console.log("crrentl palyi this must be self", window.currentPlayingPoint, r[0]);
                            this.play();
                          },
                          volume: 50
                    });
                }

            }
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

        //on stop
        r.bind("stop", function(e){
            console.log("lenn");
            e.currentTarget.velocity = 0;
            e.currentTarget.sound.stop();
        });

        r.on("reset", function(){
            console.log("resettting");
            this.trigger("pathComplete");
            this.trigger("stop");
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
        
        //move horizontally
        if(node.y==t.positionY){
            if( node.x-t.positionX > velocity){ //to right
                t.positionX+=velocity;
            }
            else if(t.positionX-node.x > velocity){  //to left
                t.positionX-=velocity;
            }
            else{
                t.positionX = node.x;
                $t.trigger("nodeArrived");
            }
        }

        //move vertically
        else if(node.x==t.positionX){
            if(node.y-t.positionY > velocity){
                t.positionY+=velocity;
            }
            else if(t.positionY-node.y > velocity){
                t.positionY-=velocity;
            }
            else{
                t.positionY = node.y;
                $t.trigger("nodeArrived");
            }
        }

        else if(node.x!=t.positionX && node.y!=t.positionY){
            
            if(node.x-t.positionX > velocity){
                t.positionX+=velocity;
            }
            else if(t.positionX-node.x > velocity){
                t.positionX-=velocity;
            }
            else{
                t.positionX = node.x
                //$t.trigger("nodeArrived");
                //return;
            }
            
            if(node.y-t.positionY > velocity){
                t.positionY+=velocity;
            }else if(t.positionY-node.y > velocity){
                t.positionY-=velocity;
            } else {
                t.positionY = node.y;
                $t.trigger("nodeArrived");
                return;
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
    
    soundManager.onready(function(){

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

        //x,y,path,id, marginLeft, marginTop, soundUrl
        var t = new $traveler(36,29,nl,1,30,24,"http://muteam.fm/dl/Ott%20-%20Mir%20(2011)/04.%20Squirrel%20And%20Biscuits.mp3");
        travelers.push(t);
        // window.sampleSound = soundManager.createSound({
        //       id: "1",
        //       url: "http://muteam.fm/dl/Ott%20-%20Mir%20(2011)/04.%20Squirrel%20And%20Biscuits.mp3",
        //       autoLoad: true,
        //       autoPlay: false,
        //       onload: function() {
        //         console.log('The sound '+this.sID+' loaded!');
                
        //         var t = new $traveler(41,29,nl,1,30,24,sampleSound);

        //         travelers.push(t);
        //         this.play();
        //       },
        //       volume: 50
        // });


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
        var t2 = new $traveler(60,60,nl2,2, 54, 55, "http://www.muteam.fm/dl/Carbon%20Based%20Lifeforms%20-%20World%20of%20Sleepers%20(2006)/03%20Carbon%20Based%20Lifeforms%20-%20Photosynthesis.mp3");
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
        var t3 = new $traveler(276,52,nl3,3, 271, 47);
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
        var t4 = new $traveler(24,80,nl4, 4, 17, 74);
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
        var t5 = new $traveler(24,92,nl5, 5, 17, 85);
        
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
        var t6 = new $traveler(24,104,nl6, 6, 17, 97);
        travelers.push(t6);
        
        var nl7 = [];
        var t7 = new $traveler(24, 115, nl7, 7,17, 108);
        travelers.push(t7);
        
        //var t8 = new $traveler();

        console.log("travelers: ", travelers);
        
    //  bind click events to mask,
    //  they are already id attributed iwth own canvas node
    

    });
    function draw(){
        clear();
        
        //currently drawing image on every cycle 
        //i think a better way could be applied
        ctx.drawImage(img,0,0,canvas.width, canvas.height);
        
        
        //draw arcs for every traveler, travler object managament can be improved dramatically
        //draw new arcs on every cycle
        $.each(travelers, function(idx, el){
            arc(el[0].positionX,el[0].positionY,4,el[0].opacity);
            moveTraveler(el,el[0].velocity);
        });
        
    }
    
    //init();
}
