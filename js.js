var dots = [];
var transdots = [];
var rotcenter = []
var dotsize;
var shape = "dots";
var canvas;
var rotcx;
var rotcy;
var clear;

function init() {
    canvas = document.getElementById("canvas");
   
    rotcenter = [Math.floor(canvas.width/2), Math.floor(canvas.height/2)];
    dotsize = 2;
    
    rotcx = document.getElementById("rotcx");
    rotcy = document.getElementById("rotcy");
    rotcx.value = rotcenter[0];
    rotcy.value = rotcenter[1];

    generateDots();
}

function generateDots() {
    dots.length = 0;
    transdots.length = 0;

    var ctx = canvas.getContext("2d");

    ctx.clearRect(0,0,canvas.width,canvas.height);
    var sel = document.getElementById("select");
    var style = sel.options[sel.selectedIndex].value;
    var n = document.getElementById("numofdots").value;
    
    if(style === "random") {
        for(i=0; i<n; i++) {
            var y = Math.floor(Math.random() * canvas.height) + 1;
            var x = Math.floor(Math.random() * canvas.width) + 1;
            dots.push([x,y]);
        }
    } else if(style === "gaussian") {
        alert(2);
    } else if(style === "regular") {
        for(i=0; i<canvas.width-2; i=i+5) {
            for(j=0; j<canvas.height-2; j=j+5) {
                dots.push([i,j]);
            }
        }
    }
    draw(dots);
}

function draw(dots) {
    var ctx = canvas.getContext("2d");
    var shapeSel = document.getElementById("shape");
    var shape = shapeSel.options[shapeSel.selectedIndex].value;
    var dotsize = document.getElementById("size").value;
    var trisidelen = Math.sqrt(5)*dotsize
    for(i=0; i<dots.length; i++) {
        if(shape === "dots") {
            ctx.beginPath();
            ctx.arc(dots[i][0], dots[i][1], dotsize, 0, 2*Math.PI);
            ctx.fillStyle="blue";
            ctx.fill();
        } else if(shape === "triangles") {
            ctx.beginPath();
            ctx.moveTo(dots[i][0], dots[i][1]);
            var x1 = dots[i][0] + trisidelen*Math.cos(Math.PI/3);
            var y1 = dots[i][1] + trisidelen*Math.sin(Math.PI/3);
            ctx.lineTo(x1,y1);
            var x2 = dots[i][0] + trisidelen;
            var y2 = dots[i][1];
            ctx.lineTo(x2,y2);
            ctx.lineTo(dots[i][0], dots[i][1]);
            ctx.fillStyle="blue";
            ctx.fill();
        }
    }
}

function drawDots() {
    draw(dots);
}

function clear() {
    var ctx = canvas.getContext("2d");
    if(document.getElementById("clear").checked) {
        ctx.clearRect(0,0,canvas.width,canvas.height);
    }
}

function rotate() {
    var ctx = canvas.getContext("2d");
    clear();
    draw(dots);

    var theta = document.getElementById("angle").value*2*Math.PI/100;
    for(i=0; i<dots.length; i++) {
        var x = dots[i][0] - rotcenter[0];
        var y = dots[i][1] - rotcenter[1];
        var tmpx = x*Math.cos(theta) - y*Math.sin(theta);
        var tmpy = x*Math.sin(theta) + y*Math.cos(theta);
        x = tmpx + rotcenter[0];
        y = tmpy + rotcenter[1];
        transdots[i] = [x,y];
    }
    draw(transdots);
    shrink();
}

function shrink() {
    var ctx = canvas.getContext("2d");
    clear();
    draw(dots);
    
    var shrinkfactor = document.getElementById("shrink").value/100;
    for(i=0; i<transdots.length; i++) {
        var x = transdots[i][0] - rotcenter[0];
        var y = transdots[i][1] - rotcenter[1];
        x = x*shrinkfactor + rotcenter[0];
        y = y*shrinkfactor + rotcenter[1];
        transdots[i] = [x,y];     
    }
    draw(transdots);
}

function changeRotCenter(event) {
    var x = event.pageX - canvas.offsetLeft;
    var y = event.pageY - canvas.offsetTop;
    rotcx.value = x;
    rotcy.value = y;
    rotcenter = [x,y];
    rotate();
}

