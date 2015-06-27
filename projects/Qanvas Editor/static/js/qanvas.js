(function() {
  root = this;
  // Usage :
  // var q = qanvas(
  //   'myCanvasId', // The canvas id
  //   true,         // fullscreen ?
  //   1,            // x-scale
  //   1);           // y scale
  // var paper = q.paper;
  // paper.rect(10,10,20,10).circle(30,30,50);
  // as you can see it's not Raphael.js, each call to any method of paper will return the paper itself , and not the created element
  // you get much less absctraction than in Raphael.js, so if you need to modify an item after it's creation, use Raphael.js instead
  root.qanvas = function(el,fullScreen,scaleX,scaleY) {
    
    // Dom Element
    var canvas = document.getElementById(el);
    if(!canvas) throw Error(el+' not found');
    // We extract the context2d
    var paper = canvas.getContext('2d');
    if(!paper) throw Error(el+'.getContext(\'2d\') not found'); 
    // We store width and height, and set the 
    var width = canvas.width = fullScreen ? document.body.clientWidth*(scaleX || 1) : canvas.width*(scaleX || 1),
        height = canvas.height = fullScreen ? document.body.clientHeight*(scaleY || 1) : canvas.height*(scaleY || 1);

    // The accessible part
    var _qanvas = function() {
      this.width = width;
      this.height = height;
    };
    _qanvas.prototype = {
    
      setDimension : function(mixin) {
        if(typeof mixin !== 'object') return;
        for(var p in mixin) {
          this[p] = mixin[p]
        }
      },
    
      // We set props
      width : width,
      height : height,
      midWidth : width/2,
      midHeight : height/2,
      // And methods
      arc : function(x,y,radius,a1,a2,cw) {
        if(a1) a1 = Math.PI/180*a1;
        if(a2) a2 = Math.PI/180*a2;
        paper.beginPath();
        paper.arc(x,y,radius,a1,a2,cw);
        paper.closePath();
        paper.stroke();
        paper.fill();
      },
      circle : function(cx,cy,radius,angle,ox,oy) {
        if(angle) angle = Math.PI/180*angle
        paper.beginPath();
        if(ox && oy) {
          var oxy = this.convert(cx,cy,ox,oy,angle);
          paper.arc(oxy[0],oxy[1],radius,angle,angle+2*Math.PI,true);
        } else {
          paper.arc(cx,cy,radius,(angle || 0),(angle || 0)+2*Math.PI,true);
        }
        paper.closePath();
        paper.stroke();
        paper.fill();
        return this;
      },
      halfCircle : function(cx,cy,radius,angle,ox,oy) {
        if(angle) angle = Math.PI/180*angle
        paper.beginPath();
        if(ox && oy) {
          var oxy = this.convert(cx,cy,ox,oy,angle);
          paper.arc(oxy[0],oxy[1],radius,angle,angle+Math.PI,true);
        } else {
          paper.arc(cx,cy,radius,(angle || 0),(angle || 0)+Math.PI,true);
        }
        paper.closePath();
        paper.stroke();
        paper.fill();
        return this;
      },
      ellipse : function(cx,cy,width,height,angle,ox,oy) {
        var xy   = [cx + height, cy - width], // C1
            xwy  = [cx + height, cy + width], // C2
            xy2  = [cx - height, cy + width], // C3
            xwy2 = [cx - height, cy - width], // C4
            xwyh = [cx, cy + width], // A2
            xyh  = [cx, cy - width];  // A1
        
        if(angle) {
          angle = Math.PI/180*angle;
          var ox = ox || cx,
              oy = oy || cy;
        
          xy   = this.convert(cx + height,cy - width,ox,oy,angle);
          xwy  = this.convert(cx + height,cy + width,ox,oy,angle); 
          xy2  = this.convert(cx - height,cy + width,ox,oy,angle);
          xwy2 = this.convert(cx - height,cy - width,ox,oy,angle); 
          xwyh = this.convert(cx,cy + width,ox,oy,angle); 
          xyh  = this.convert(cx,cy - width,ox,oy,angle); 
        }
        
        var t = xy.concat(xwy.concat(xwyh)),
            t2 = xy2.concat(xwy2.concat(xyh));
        paper.beginPath();
        paper.moveTo.apply(paper,xyh); // A1
        paper.bezierCurveTo.apply(paper,t); // Bezier 1
        paper.bezierCurveTo.apply(paper,t2); // Bezier 2
        paper.closePath();
        paper.stroke();
        paper.fill();
        return this;
      },
      halfEllipse : function(cx,cy,width,height,angle,ox,oy) {
        var xy   = [cx + height, cy - width], // C1
            xwy  = [cx + height, cy + width], // C2
            xwyh = [cx, cy + width], // A2
            xyh  = [cx, cy - width];  // A1
        
        if(angle) {
          angle = Math.PI/180*angle;
          var ox = ox || cx,
              oy = oy || cy;
        
          xy   =  this.convert(cx + height,cy - width,ox,oy,angle);
          xwy  = this.convert(cx + height,cy + width,ox,oy,angle); 
          xwyh = this.convert(cx,cy + width,ox,oy,angle); 
          xyh  = this.convert(cx,cy - width,ox,oy,angle); 
        }
        
        var t = xy.concat(xwy.concat(xwyh));
        paper.beginPath();
        paper.moveTo.apply(paper,xyh); // A1
        paper.bezierCurveTo.apply(paper,t); // Bezier
        paper.closePath();
        paper.stroke();
        paper.fill();
        return this;
      },
      square : function(x,y,side,angle,ox,oy) {
        var xy = [x,y];
            xwy = [x+side,y],
            xwyh = [x+side,y+side],
            xyh = [x,y+side];
        
        if(angle) {
          angle = Math.PI/180*angle;
          var ox = ox || x+side/2,
              oy = oy || y+side/2;
        
          xy   = this.convert(x,y,ox,oy,angle);
          xwy  = this.convert(x+side,y,ox,oy,angle); 
          xwyh = this.convert(x+side,y+side,ox,oy,angle); 
          xyh  = this.convert(x,y+side,ox,oy,angle); 
        }
        paper.beginPath();
        paper.moveTo.apply(paper,xy);
        paper.lineTo.apply(paper,xwy);
        paper.lineTo.apply(paper,xwyh);
        paper.lineTo.apply(paper,xyh);
        paper.closePath();
        paper.stroke();
        paper.fill();
        return this;
      },
      rect : function(x,y,width,height,angle,ox,oy) {
        var xy   = [x,y],
            xwy  = [x+width,y],
            xwyh = [x+width,y+height],
            xyh  = [x,y+height];
        
        if(angle) {
          angle = Math.PI/180*angle;
          var ox = ox || x+width/2,
              oy = oy || y+height/2;
        
          xy   =  this.convert(x,y,ox,oy,angle);
          xwy  = this.convert(x+width,y,ox,oy,angle); 
          xwyh = this.convert(x+width,y+height,ox,oy,angle); 
          xyh  = this.convert(x,y+height,ox,oy,angle); 
        }
        paper.beginPath();
        paper.moveTo.apply(paper,xy);
        paper.lineTo.apply(paper,xwy);
        paper.lineTo.apply(paper,xwyh);
        paper.lineTo.apply(paper,xyh);
        paper.closePath();
        paper.stroke();
        paper.fill();
        return this;
      },
      quadri : function(x1,y1,x2,y2,x3,y3,x4,y4,angle,ox,oy) {
        var xy   = [x1,y1];
            xwy  = [x2,y2],
            xwyh = [x3,y3],
            xyh  = [x4,y4];
        
        if(angle) {
          angle = Math.PI/180*angle;
          var ox = ox || (x1+x2+x3+x4)/4,
              oy = oy || (y1+y2+y3+y4)/4;

          xy   =  this.convert(x1,y1,ox,oy,angle);
          xwy  = this.convert(x2,y2,ox,oy,angle); 
          xwyh = this.convert(x3,y3,ox,oy,angle); 
          xyh  = this.convert(x4,y4,ox,oy,angle); 
        }
        paper.beginPath();
        paper.moveTo.apply(paper,xy);
        paper.lineTo.apply(paper,xwy);
        paper.lineTo.apply(paper,xwyh);
        paper.lineTo.apply(paper,xyh);
        paper.closePath();
        paper.stroke();
        paper.fill();
        return this
      },
      image : function(x,y,image) {
        paper.drawImage(image,x,y);
        return this;
      },
      text : function(x,y,text) {
        paper.fillText(text,x,y);
        return this; //21h54
      },
      line : function(x1,y1,x2,y2,angle,ox,oy) {
        var xy = [x1,y1],
            xy2 = [x2,y2];
            
        if(angle) {
          angle = angle/180*Math.PI;
          var ox = ox || (x1+x2)/2,
              oy = oy || (y1+y2)/2;
              
          xy = this.convert(x1,y1,ox,oy,angle);
          xy2 = this.convert(x2,y2,ox,oy,angle);
        }
        paper.beginPath();
        paper.moveTo.apply(paper,xy);
        paper.lineTo.apply(paper,xy2);
        paper.closePath();
        paper.stroke();
        paper.fill();
        return this;
      },
      c2p : function(x,y) {
        var r = Math.sqrt(x*x+y*y),
            a = Math.atan(y/x);
        if(x < 0 && y >= 0) a += Math.PI // second quadrand
        if(x < 0 && y < 0) a += Math.PI // third
        if(x >= 0 && y < 0) a += 2*Math.PI  // fourth
        return [r,a];
      },
      p2c : function(r,a) {
        var x = r*Math.cos(a),
            y = r*Math.sin(a);
        return [x,y];
      },
      convert : function(x,y,ox,oy,angle) {
        var xy = this.c2p(x-ox,y-oy);
        xy[1] += angle
        xy = this.p2c.apply(null,xy);
        xy[0] += ox;
        xy[1] += oy;
        return xy;
      },
      compute2d : function(a,c,t,e) {

        var dx = Math.cos(t[1]) * (Math.sin(t[2]) * (a[1]-c[1]) + Math.cos(t[2]) * (a[0]-c[0])) - Math.sin(t[1])*(a[2]-c[2]),
            dy = Math.sin(t[0]) * (Math.cos(t[1]) * (a[2]-c[2]) + Math.sin(t[1]) * (Math.sin(t[2]) *(a[1]-c[1])+Math.cos(t[2])*(a[0]-c[0])))+Math.cos(t[0])*(Math.cos(t[2])*(a[1]-c[1])-Math.sin(t[2])*(a[0]-c[0])),
            dz = Math.cos(t[0]) * (Math.cos(t[1]) * (a[2]-c[2]) + Math.sin(t[1]) * (Math.sin(t[2]) *(a[1]-c[1])+Math.cos(t[2])*(a[0]-c[0])))-Math.sin(t[0])*(Math.cos(t[2])*(a[1]-c[1])-Math.sin(t[2])*(a[0]-c[0]));

        var bx = (dx-e[0])*(e[2]/dz),
            by = (dy-e[1])*(e[2]/dz);

        return [bx,by];
      },
      fill : function(fillStyle) {
        if(!fillStyle) return paper.fillStyle;
        paper.fillStyle = fillStyle;
        return this;
      },
      stroke : function(strokeStyle) {
        if(!strokeStyle) return paper.strokeStyle;
        paper.strokeStyle = strokeStyle;
        return this;
      }, 
      style : function(style) {
        if(style && typeof style !== 'object') throw TypeError('style should be an object, but it\'s a '+typeof style);   
        for(var prop in style) {
          if(paper.hasOwnProperty(prop) || typeof paper[prop] !== 'function') {
            paper[prop] = style[prop];
          }
        }
        return this;
      },
      fastStyle : function(prop,value) {
        if(!prop || !value) throw Error('missing arguments');
        paper[prop] = value;
        return this;
      },
      composite : function(mode) {
        paper.globalCompositeOperation = mode;
      },
      clear : function(x,y,width,height) {
        (arguments.length === 4) ? paper.clearRect(x,y,width,height) : paper.clearRect(0,0,this.width,this.height);
        return this;
      },
      multself : function( vec3 ) {
        return {x:vec3.y*vec3.z-vec3.z*vec3.y,
                y:vec3.z*vec3.x-vec3.x*vec3.z,
                z:vec3.x*vec3.y-vec3.y*vec3.x};
      },
      multv3 : function( vec3 ) {
        return this.multself(this.multself(vec3));
      },
      mix : function( x,y,a ) {
        return x*(1-a)+y*a;
      },
      floorv3 : function( vec3 ) {
        var fl = Math.floor;
        return {x : fl(vec3.x),
                y : fl(vec3.y),
                z : fl(vec3.z)};
      },
      fractf : function( f ) {
        return f-Math.floor(f);
      },
      fractv3 : function( vec3 ) {
        var fl = Math.floor;
        return {x:vec3.x-fl(vec3.x),
                y:vec3.y-fl(vec3.y),
                z:vec3.z-fl(vec3.z)};
      },
      hash : function( n ) {
        return this.fractf( Math.cos(Math.sin( n ))*43758.5453 );
      },
      noise : function( vec3 ) {
        var p = this.floorv3( vec3 );
        var f = this.fractv3( vec3 );

        f.x = 3.0-2.0*f.x;
        f.y = 3.0-2.0*f.y;
        f.z = 3.0-2.0*f.z;
        
        f = this.multv3(f);

        var n = p.x + 57.0*p.y + 113.0*p.z;

        var res =   this.mix(this.mix(this.mix( this.hash(n+  0.0), this.hash(n+  1.0),f.z),
                                      this.mix( this.hash(n+ 57.0), this.hash(n+ 58.0),f.z),f.z),
                             this.mix(this.mix( this.hash(n+113.0), this.hash(n+114.0),f.z),
                                      this.mix( this.hash(n+170.0), this.hash(n+171.0),f.x),f.x),f.y);
        return res;
      },
      fbm : function(p) {
        var f = 0.0;
        f += 0.5000*this.noise( p ); p.x *=2.02; p.y *=2.02; p.z *=2.02;
        f += 0.2500*this.noise( p ); p.x *=2.03; p.y *=2.03; p.z *=2.03;
        f += 0.1250*this.noise( p ); p.x *=2.01; p.y *=2.01; p.z *=2.01;
        f += 0.0625*this.noise( p );
        return f/0.9375;
      },
      perlin : {
        noise: function(x,y,z) {
        
          var p = new Array(512);
          var permutation = [ 151,160,137,91,90,15,
            131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
            190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
            88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
            77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
            102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
            135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
            5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
            223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
            129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
            251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
            49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
            138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180 ];
            
          for (var i=0; i < 256 ; i++) p[256+i] = p[i] = permutation[i]; 
          
          var X = Math.floor(x) & 255,                  // FIND UNIT CUBE THAT
              Y = Math.floor(y) & 255,                  // CONTAINS POINT.
              Z = Math.floor(z) & 255;
              x -= Math.floor(x);                                // FIND RELATIVE X,Y,Z
              y -= Math.floor(y);                                // OF POINT IN CUBE.
              z -= Math.floor(z);
          var u = fade(x),                                // COMPUTE FADE CURVES
              v = fade(y),                                // FOR EACH OF X,Y,Z.
              w = fade(z);
          var A = p[X  ]+Y, AA = p[A]+Z, AB = p[A+1]+Z,      // HASH COORDINATES OF
              B = p[X+1]+Y, BA = p[B]+Z, BB = p[B+1]+Z;      // THE 8 CUBE CORNERS,
              
          return scale(lerp(w, lerp(v, lerp(u, grad(p[AA  ], x  , y  , z   ),  // AND ADD
                             grad(p[BA  ], x-1, y  , z   )), // BLENDED
                     lerp(u, grad(p[AB  ], x  , y-1, z   ),  // RESULTS
                             grad(p[BB  ], x-1, y-1, z   ))),// FROM  8
             lerp(v, lerp(u, grad(p[AA+1], x  , y  , z-1 ),  // CORNERS
                             grad(p[BA+1], x-1, y  , z-1 )), // OF CUBE
                     lerp(u, grad(p[AB+1], x  , y-1, z-1 ),
                             grad(p[BB+1], x-1, y-1, z-1 )))));
           
          function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
          function lerp( t, a, b) { return a + t * (b - a); }
          function grad(hash, x, y, z) {
            var h = hash & 15;                      // CONVERT LO 4 BITS OF HASH CODE
            var u = h<8 ? x : y,                 // INTO 12 GRADIENT DIRECTIONS.
            v = h<4 ? y : h==12||h==14 ? x : z;
            return ((h&1) == 0 ? u : -u) + ((h&2) == 0 ? v : -v);
          } 
          function scale(n) { return (1 + n)/2; }
        }
      }
    };
    
    return new _qanvas;
  };
  
  return root;
  
}).call(this);
