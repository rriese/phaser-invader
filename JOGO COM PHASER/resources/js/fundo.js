function Fundo() {
	this.fps = 60;
	this.canvas = null;
	this.width = 0;
	this.width = 0;
	this.minVelocity = 15;
	this.maxVelocity = 30;
	this.pontos = 100;
	this.intervalId = 0;
}

//	inicia o fundo
Fundo.prototype.initialise = function(div) {
	var essaVar = this;

	//	armazena a div
	this.containerDiv = div;
	essaVar.width = window.innerWidth;
	essaVar.height = window.innerHeight;

	window.onresize = function(event) {
		essaVar.width = window.innerWidth;
		essaVar.height = window.innerHeight;
		essaVar.canvas.width = essaVar.width;
		essaVar.canvas.height = essaVar.height;
		essaVar.draw();
 	}

	//	cria o canvas
	var canvas = document.createElement('canvas');
	div.appendChild(canvas);
	this.canvas = canvas;
	this.canvas.width = this.width;
	this.canvas.height = this.height;
};

Fundo.prototype.start = function() {

	//	cria os pontos
	var pontos = [];
	for(var i=0; i<this.pontos; i++) {
		pontos[i] = new Ponto(Math.random()*this.width, Math.random()*this.height, Math.random()*3+1,
		 (Math.random()*(this.maxVelocity - this.minVelocity))+this.minVelocity);
	}
	this.pontos = pontos;

	var essaVar = this;
	//	inicia o intervalo
	this.intervalId = setInterval(function() {
		essaVar.update();
		essaVar.draw();	
	}, 1000 / this.fps);
};

Fundo.prototype.stop = function() {
	clearInterval(this.intervalId);
};

Fundo.prototype.update = function() {
	var dt = 1 / this.fps;

	for(var i=0; i<this.pontos.length; i++) {
		var ponto = this.pontos[i];
		ponto.y += dt * ponto.velocity;
		//	reinicia os pontos
		if(ponto.y > this.height) {
			this.pontos[i] = new Ponto(Math.random()*this.width, 0, Math.random()*3+1, 
		 	(Math.random()*(this.maxVelocity - this.minVelocity))+this.minVelocity);
		}
	}
};

Fundo.prototype.draw = function() {

	// atualiza o background
	var ctx = this.canvas.getContext("2d");
 	ctx.fillStyle = '#000000';
	ctx.fillRect(0, 0, this.width, this.height);

	//	desenha pontos.
	ctx.fillStyle = '#ffffff';
	for(var i=0; i<this.pontos.length;i++) {
		var ponto = this.pontos[i];
		ctx.fillRect(ponto.x, ponto.y, ponto.size, ponto.size);
	}
};

function Ponto(x, y, size, velocity) {
	this.x = x;
	this.y = y; 
	this.size = size;
	this.velocity = velocity;
}