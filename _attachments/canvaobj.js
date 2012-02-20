var canva = (function(){
	
	var result = {
	
	};
	
	result.init = function(id, width, height){ //default options, exception handling
		this.id = id;
		this.width = width;
		this.height = height;
		var c = document.getElementById(id);
		c.width = width;
		c.height = height;
		this.canvas = c;
		this.ctx = this.canvas.getContext("2d");
	}
	
	result.loadImgFromSource = function(imgSrc){
		var img = new Image();
		img.src = imgSrc;
		this.imgSource = imgSrc;
		
		var that = this;
		img.onload = function(){
			that.canvas.width = this.width;
			that.canvas.height = this.height;
			
			that.ctx.drawImage(this,0,0);
		}
	}
	
	result.draw = function(m,t){
		setInterval(m,t);
	}
	
	return result;
})(canva || {});
