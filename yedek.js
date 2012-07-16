			
			var traveler = function(positionVector){
				this.position = positionVector;
			}
			
			traveler.prototype.moveX = function(){
				this.position.x = this.position.x+1;
			}
			
			traveler.prototype.moveY = function(){
				this.position.y = this.position.y+1;
			}
			
			traveler.prototype.moveUntilX = function(xLimit){
				if( this.position.x == xLimit){
					return;
				} else {
					this.position.x = this.position.x+1;
				}
			}
			
			traveler.prototype.moveToHorizontalSibling = function(xLimit){
				if(this.position.x === xLimit){
					console.log("hor",xLimit,this.position.x);
					currentNode=currentNode+1;
					return;
				} else {
					if(xLimit > this.position.x){
						this.position.x = this.position.x+1;
					} else {
						this.position.x = this.position.x-1;
					}
					
				}
			}
			
			traveler.prototype.moveToVerticalSibling = function(yLimit){
				if( this.position.y == yLimit){
					console.log("ver")
					currentNode=currentNode+1;
					return;
				} else {
					if(yLimit > this.position.y){
						this.position.y = this.position.y+1;
					} else {
						this.position.y = this.position.y-1;
					}
					
				}
			}
			
// 			traveler.prototype.moveToNextNode = function(node){
// 				//move 
// 				if(this.position.y == node.y){
// 					this.moveToHorizontalSibling(node.x);
// 				} else if(this.position.x == node.x){
// 					this.moveToVerticalSibling(node.y);
// 				}

// 			}
			
			traveler.prototype.moveThroughNodes = function(nodesList){ //nodesList array of vector objects
				for(var i=0; i<nodesList.length; i++){
					var node = nodesList[i];
					console.log(node);
					this.moveToNextNode(node);
				}
			}