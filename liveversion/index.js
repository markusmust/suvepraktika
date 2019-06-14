
        var scaling = "fit";
        var width = 2000;
        var height = 1000;
        var countPieces = 0;
        var totalPieces = 0;
        var counterL = 0;
        var a = new Game(); //õhupallide mängu muutuja
        var varviArray = ["blue", "green", "lightblue", "pink", "red", "yellow"]; //Õhupallide värvi array
        // as of ZIM 5.5.0 you do not need to put zim before ZIM functions and classes
        var frame = new Frame(scaling, width, height);
        frame.on("ready", function()
        {
            zog("ready from ZIM Frame");

            var stage = frame.stage;
            var stageW = frame.width;
            var stageH = frame.height;

            zim.OPTIMIZE = true;
            Ticker.update = true;

            var puzzleX;
            var puzzleY;

            var con = new Container

            // with chaining - can also assign to a variable for later access
            var imageObj = [];
            var piecesArrayObj = [];
            frame.loadAssets(["nemo.jpg"], "assets/");
            frame.on("complete", function() {


                imageObj = frame.asset("nemo.jpg").clone();
                imageObj.addTo(con);
                imageObj.alpha = 0.3;

                var piecesArray = new Array();
                var horizontalPieces = 3;
                var verticalPieces = 3;
                var obj = getQueryString();
                zog(obj)
                if(obj)
                {
                   horizontalPieces = obj.row;
                   verticalPieces = obj.column;
                }
                var imageWidth = imageObj.width;
                var imageHeight = imageObj.height;
                var pieceWidth = Math.round(imageWidth / horizontalPieces);
                var pieceHeight = Math.round(imageHeight / verticalPieces);
                var gap = 40;
                totalPieces = horizontalPieces*verticalPieces;

                puzzleX = frame.width/2-imageWidth/2;
                puzzleY = frame.height/2-imageHeight/2;
                imageObj.pos(puzzleX,puzzleY);
                zog(puzzleX,puzzleY);

                for (j = 0; j < verticalPieces; j++) {
                    piecesArrayObj[j] = [];
                    for (i = 0; i < horizontalPieces; i++) {
                        var n = j + i * verticalPieces;

                        var offsetX = pieceWidth * i;
                        var offsetY = pieceHeight * j;


                        var x8 = Math.round(pieceWidth / 8);
                        var y8 = Math.round(pieceHeight / 8);

                        piecesArrayObj[j][i] = new Object();
                        piecesArrayObj[j][i].right = Math.floor(Math.random() * 2);
                        piecesArrayObj[j][i].down = Math.floor(Math.random() * 2);

                        if (j > 0) {
                            piecesArrayObj[j][i].up = 1 - piecesArrayObj[j - 1][i].down;
                        }
                        if (i > 0) {
                            piecesArrayObj[j][i].left = 1 - piecesArrayObj[j][i - 1].right;
                        }

                        piecesArray[n] = new Rectangle({
                            width: pieceWidth,
                            height: pieceHeight,

                        });

                        var tileObj = piecesArrayObj[j][i];
                        var s = new Shape

                        var context = s.graphics;
                        s.drag();
                        s.mouseChildren = false;
                        s.addEventListener("pressup", function(e) {
                            var mc = e.currentTarget;

                            var xx = Math.round(mc.x);
                            var yy = Math.round(mc.y);
                            // kui lähedalt kinni võtab tüki, mida väiksem seda lähemalt
                            if (xx < puzzleX+gap / 0.3 && xx > puzzleX-gap / 0.3 && yy < puzzleX+gap / 0.3 && yy > puzzleY-gap / 0.3) {
                                 mc.x = puzzleX;
                                mc.y = puzzleY;
                                mc.noDrag();
                                mc.addTo(mc.parent,0);
                                mc.mouseChildren = false;
                                mc.mouseEnabled = false;
                                mc.hint.visible = false;
                                countPieces++;

                                var audio = document.getElementById("puzzlePieceRight");
                                audio.currentTime=0;
                                audio.volume = 0.1;
                                audio.play(); 
                                // audio from http://soundbible.com/tags-cheer.html

                                zog("countPieces",countPieces);
                                if(countPieces == totalPieces)
                                {   
                                    
                                    var audio = document.getElementById("puzzleCompleted");
                                    audio.volume = 0.1;
                                    audio.play();

                                    var pane = new Pane({width:350,label:"Väga tubli!", height:225, modal:false, displayClose:false});
                                    a.startGame(); //Sellest algavad õhupallid
                                    var confirm = new Button(120, 50, "Uuesti!", "green").center(pane).mov(0,70);

                                    confirm.on("click", function() {
                                        pane.hide();
                                        window.location.replace(window.location.pathname + window.location.search + window.location.hash);

                                    });
                                    pane.show();
                                }
                                stage.update();

                            }

                        });
                        context.setStrokeStyle(3,"round");
                        var commandi1 = context.beginStroke(createjs.Graphics.getRGB(0, 0, 0)).command;
                        //
                        var commandi = context.beginBitmapFill(imageObj.image).command;

                        context.moveTo(offsetX, offsetY);

                        if (j != 0) {
                            context.lineTo(offsetX + 3 * x8, offsetY);
                            if (tileObj.up == 1) {
                                context.curveTo(offsetX + 2 * x8, offsetY - 2 * y8, offsetX + 4 * x8, offsetY - 2 * y8);
                                context.curveTo(offsetX + 6 * x8, offsetY - 2 * y8, offsetX + 5 * x8, offsetY);
                            } else {
                                context.curveTo(offsetX + 2 * x8, offsetY + 2 * y8, offsetX + 4 * x8, offsetY + 2 * y8);
                                context.curveTo(offsetX + 6 * x8, offsetY + 2 * y8, offsetX + 5 * x8, offsetY);
                            }
                        }
                        context.lineTo(offsetX + 8 * x8, offsetY);
                        if (i != horizontalPieces - 1) {
                            counterL++;
                            context.lineTo(offsetX + 8 * x8, offsetY + 3 * y8);
                            if (tileObj.right == 1) {
                                context.curveTo(offsetX + 10 * x8, offsetY + 2 * y8, offsetX + 10 * x8, offsetY + 4 * y8);
                                context.curveTo(offsetX + 10 * x8, offsetY + 6 * y8, offsetX + 8 * x8, offsetY + 5 * y8);
                            } else {
                                context.curveTo(offsetX + 6 * x8, offsetY + 2 * y8, offsetX + 6 * x8, offsetY + 4 * y8);
                                context.curveTo(offsetX + 6 * x8, offsetY + 6 * y8, offsetX + 8 * x8, offsetY + 5 * y8);
                            }
                        }
                        context.lineTo(offsetX + 8 * x8, offsetY + 8 * y8);
                        if (j != verticalPieces - 1) {
                            context.lineTo(offsetX + 5 * x8, offsetY + 8 * y8);
                            if (tileObj.down == 1) {
                                context.curveTo(offsetX + 6 * x8, offsetY + 10 * y8, offsetX + 4 * x8, offsetY + 10 * y8);
                                context.curveTo(offsetX + 2 * x8, offsetY + 10 * y8, offsetX + 3 * x8, offsetY + 8 * y8);
                            } else {
                                context.curveTo(offsetX + 6 * x8, offsetY + 6 * y8, offsetX + 4 * x8, offsetY + 6 * y8);
                                context.curveTo(offsetX + 2 * x8, offsetY + 6 * y8, offsetX + 3 * x8, offsetY + 8 * y8);
                            }
                        }
                        context.lineTo(offsetX, offsetY + 8 * y8);
                        if (i != 0) {
                            context.lineTo(offsetX, offsetY + 5 * y8);
                            if (tileObj.left == 1) {
                                context.curveTo(offsetX - 2 * x8, offsetY + 6 * y8, offsetX - 2 * x8, offsetY + 4 * y8);
                                context.curveTo(offsetX - 2 * x8, offsetY + 2 * y8, offsetX, offsetY + 3 * y8);
                            } else {
                                context.curveTo(offsetX + 2 * x8, offsetY + 6 * y8, offsetX + 2 * x8, offsetY + 4 * y8);
                                context.curveTo(offsetX + 2 * x8, offsetY + 2 * y8, offsetX, offsetY + 3 * y8);
                            }
                        }
                        context.lineTo(offsetX, offsetY);
                        s.addTo(con);

                        var fill = new createjs.Graphics.Fill("red");


                        var hint = new Shape();
                        hint.mouseChildren = false;
                        hint.mouseEnabled = false;
                        s.hint = hint;
                        hint.graphics = context.clone(true);
                        hint.pos(puzzleX,puzzleY);

                        hint.graphics._fill = fill;
                        hint.graphics._fill.style = null;

                        hint.addTo(con,0);

                        s.animate({obj:{x:rand(-offsetX,frame.width-offsetX-pieceWidth),y:rand(-offsetY,frame.height-offsetY-pieceHeight)}, time:700});

                    }
                }


                con.addTo(stage);
                stage.update();



            }); // end asset complete


            stage.update(); // this is needed to show any changes

        }); // end of ready


// õhupallide kood
function Game(){
  this.density = null;
  this.canvasElement = document.getElementById('canvasDiv');
  this.updateTime = null;
  this.densityStep = null;
  this.balloonsArray = null;
  var thiz = this;
  this.updater = function(){
    thiz.updateGame();
  };
}
Game.prototype.startGame = function(){
  setInterval(this.updater, this.updateTime);
  setInterval(this.counter, this.updateTime);
};
Game.prototype.updateGame = function(){
  this.densityStep += this.density;
  if(this.densityStep >= 1 && this.balloonsArray.length < 15) //Array lengthi suurusega saab muuta mitu õhupalli tuleb
  {
    for(var i = 0; i < parseInt(this.densityStep, 10); i++)
    {
      var tempBalloon = new Balloon(0, -500, randomvarv());
      tempBalloon.positionX = tempBalloon.generateRandomXPos();
      var el = document.createElement('div');
      el.className = 'balloon '+ tempBalloon.color;
      el.style.left = tempBalloon.positionX+'px';
      el.style.bottom = tempBalloon.positionY+'px';

      el.onsubmit = function(){
        setInterval(bobXtest, 600);
        setInterval(bobYtest, 1200);
        function bobXtest(){
          $(el).removeClass("bobY");
          $(el).addClass("bobX");
        }
        function bobYtest(){
          $(el).removeClass("bobX");
          $(el).addClass("bobY");
        }
      }
      function after(ms, fn){ setTimeout(fn, ms); }
      el.onclick = function(){
        var audio = new Audio('http://www.tlu.ee/~mustmark/suvepraktika/assets/Balloon_pop.mp3');
        audio.currentTime=0;
        audio.volume = 0.1;
        audio.play(); 
        
        $(el).animate({
          opacity: 0,
        }, 100);
        setTimeout(sleep, 100);
      };

        function sleep(){
          el.parentNode.removeChild(el);
        }

      this.canvasElement.appendChild(el);
      var tempObj = {};
      tempObj.el = el;
      tempObj.speed = tempBalloon.getRandomSpeed();
      this.balloonsArray.push(tempObj);
      $(el).trigger('submit');

    }
    this.densityStep = 0;
  }
  for(var j = 0; j < this.balloonsArray.length; j++)
  {
    this.balloonsArray[j].el.style.bottom = (parseInt(this.balloonsArray[j].el.style.bottom, 10)+(1+this.balloonsArray[j].speed))+'px';
  }
};
Game.prototype.initGame = function(){
  this.density = 0.2;
  this.updateTime = 50;
  this.densityStep = 0.2;
  this.balloonsArray = [];
};
function Balloon(x, y, color){
  this.positionX = x;
  this.positionY = y;
  this.color = color;
}
Balloon.prototype.getRandomSpeed = function(){
  return Math.floor(Math.random() * 10);
};
Balloon.prototype.generateRandomXPos = function(){
  return Math.floor((Math.random() * 1350) - 150);
};
window.addEventListener('load',function(){
  a.initGame();
});
function randomvarv(){
  var varviNr = Math.floor(Math.random() * 6);
  return String(varviArray[varviNr]);
}
