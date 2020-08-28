"use strict";

//set variables these if you want to use the draw functions
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d')




//points are arrays [x,y]


//line with slope and y intercept
class LinearLine {
  constructor(slope, yint, leftBound = -Infinity, rightBound = Infinity) {
    this.slope = slope;
    this.yint = yint; //y intercept
    this.leftBound = leftBound; //used to represend the leftmost coordinate of a line segment or ray
    this.rightBound = rightBound; //used to represend the rightmost coordinate of a line segment or ray
  }
  
  //input an x cordinate and output a y
  eval(n) {
    return n * this.slope + this.yint;
  };
  
  //return the point where this line intersects with another
  intersect(line) {
    var xint = (line.yint - this.yint) / (this.slope - line.slope);
    return [xint, this.eval(xint)];
  };
  
  //normal intersect, but won't return anything if the intersect is out of both lines bounds
  segIntersect(line) {
    var inter = this.intersect(line);
    if (inter[0] >= this.leftBound && inter[0] <= this.rightBound && inter[0] >= line.leftBound && inter[0] <= line.rightBound) {
      return inter;
    }
  }
  
  draw() {
    ctx.beginPath();
    ctx.moveTo(0,this.yint);
    ctx.lineTo(canvas.width,this.eval(canvas.width));
    ctx.stroke();
    ctx.closePath();
  }
  
  drawSeg() {
    if (this.leftBound == -Infinity) {
      var left = 0;
    } else {
      var left = this.leftBound
    }
    
    if (this.rightBound == Infinity) {
      var right = canvas.width;
    } else {
      var right = this.rightBound;
    }
    
    ctx.beginPath();
    ctx.moveTo(left,this.eval(left));
    ctx.lineTo(right,this.eval(right));
    ctx.stroke();
    ctx.closePath();
  }
  
  drawIntersect(line) {
    var point = this.intersect(line);
    ctx.beginPath();
    ctx.arc(point[0], point[1],7,0,Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }
  
  drawSegIntersect(line) {
    var point = this.segIntersect(line);
    if (point === undefined) {return;}
    ctx.beginPath();
    ctx.arc(point[0], point[1],7,0,Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }
}

//shape made of points and lines
class LinearShape {
  constructor(points, closeShape) {
    this.points = points;
    this.lines = [];
    for (var i = 0; i < points.length - 1; i++) {
      this.lines.push(linearPointLine(points[i], points[i + 1]));
    }
    this.lines.push(linearPointLine(points[points.length - 1], points[0]));
  }
  
  //where the line segments intersect with a line
  intersects(line) {
    var inters = [];
    for (var i = 0; i < this.lines.length; i++) {
      var interr = this.lines[i].segIntersect(line);
      if (interr !== undefined) {
        inters.push(interr);
      }
    }
    return inters;
  }
  
  //where each line  intersects with another line
  lineIntersects(line) {
    var inters = [];
    for (var i = 0; i < this.lines.length; i++) {
      inters.push(this.lines[i].intersect(line));
    }
    return inters;
  }
  
  //where this shape nitersects with another
  shapeIntersects(shape) {
    var vals = [];
    for (var i = 0; i < shape.lines.length; i++) {
      vals = vals.concat(this.intersects(shape.lines[i]));
    }
    return vals;
  }
  
  shapeLineIntersects(shape) {
    var vals = [];
    for (var i = 0; i < shape.lines.length; i++) {
      vals = vals.concat(this.lineIntersects(shape.lines[i]));
    }
    return vals;
  }
  
  draw() {
    ctx.beginPath();
    ctx.moveTo(this.points[0][0], this.points[0][1]);
    for (var i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i][0], this.points[i][1]);
    }
    ctx.lineTo(this.points[0][0], this.points[0][1]);
    ctx.stroke();
    ctx.closePath();
  }
  
  drawLines() {
    for (var i = 0; i < this.lines.length; i++) {
      this.lines[i].draw();
    }
  }
  
  drawIntersects(line) {
    var dots = this.intersects(line)
    for (var i = 0; i < dots.length; i++) {
      ctx.beginPath();
      ctx.arc(dots[i][0],dots[i][1],7,0,Math.PI*2);
      ctx.fill();
      ctx.closePath();
    }
  }
  
  drawLineIntersects(line) {
    var dots = this.lineIntersects(line)
    for (var i = 0; i < dots.length; i++) {
      ctx.beginPath();
      ctx.arc(dots[i][0],dots[i][1],7,0,Math.PI*2);
      ctx.fill();
      ctx.closePath();
    }
  }
  
  drawShapeIntersects(shape) {
    var dots = this.shapeIntersects(shape)
    for (var i = 0; i < dots.length; i++) {
      ctx.beginPath();
      ctx.arc(dots[i][0],dots[i][1],7,0,Math.PI*2);
      ctx.fill();
      ctx.closePath();
    }
  }
  
  drawShapeLineIntersects(shape) {
    var dots = this.shapeLineIntersects(shape)
    for (var i = 0; i < dots.length; i++) {
      ctx.beginPath();
      ctx.arc(dots[i][0],dots[i][1],7,0,Math.PI*2);
      ctx.fill();
      ctx.closePath();
    }
  }
}


//return a line from 2 points. default left and right bound will be the smallest and biggest x values respectively
function linearPointLine(p1,p2,leftBound = Math.min(p1[0],p2[0]),rightBound = Math.max(p1[0],p2[0])) {
  if (p1[0] == p2[0]) {
    p2[0] += 0.00001
    rightBound += 0.00001;
  }
  
  var slope = (p1[1] - p2[1]) / (p1[0] - p2[0]);
  return new LinearLine(slope, p1[1] - (p1[0] * slope),leftBound,rightBound);
}
