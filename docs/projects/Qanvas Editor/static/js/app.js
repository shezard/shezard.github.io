
window.onload = function() {
  
  // RESIZE
  window.onresize = function() {
    action.exec();
  };
  
  // INIT
  
  // We get our qanvas, and we want it fullScreen with a x scale of .5 , 
  //   then we just grab the paper & pre clear it
  window.paper = qanvas('canvas',true,.5).clear();
  
  // CODE MIRROR

  var $textarea = $('#textarea-wrapper');

  var codeMirror = CodeMirror($textarea[0], {
    mode:  "javascript",
    tabSize : 2,
    value : '// press ctrl + enter to run the code\n// press ctrl + h to toggle full screen mode\n\n// a list of built-in function is available at\n// https://github.com/shezard/qanvas\n\nloop(function(t) {\n  circle(width/2,height/2,t);\n});'
  });
  
  // We feed Math with the content of paper
  for(var p in paper) {
    if(!Math[p]) Math[p] = paper[p];
  };
  
  // We add more stuff into Math
  Math._x = 0;
  Math._y = 0;
  Math._tick = 0;
  Math._id = 0;
  Math._f = null;
  Math._cb = null;
  
  // Again
  Math.loop = function(cb,clear) {
    Math._cb = function() { 
      Math._tick++;
      clear && paper.clear();
      cb && cb(Math._tick);
      Math._id = requestAnimationFrame(Math._cb);
    }
    Math._cb();
  };
  
  // And again
  Math.loadFile = function(varName,imageName,cb) {
    // And even again inside ?
    Math.media = Math.media || {};
    Math.media[varName] = new Image();
    Math.media[varName].onload = function() {
      this.isLoaded = true;
      Math.loaded++;
      if(Math.shouldLoad === Math.loaded) {
        cb && cb();
      }
    }
    if(!imageName.match('http')) imageName = './static/media/'+imageName;
    Math.media[varName].src = imageName;
  };
  
  var $t = $('.CodeMirror')[0];
  
  var options = {
    fs : false
  };
  
  // ERROR DETECTION
  
  var error = function(data) {
    try {
      return JSON.parse(data).error;
    } catch(e) {
      return false;
    }
  }
  
  // CUSTOM PROMPT
  
  var cPrompt = function(promptText,cb,cbFail) {
  
    var p = prompt(promptText);
    if(p) {
      if(cb && typeof cb === 'function') cb(p);
    } else {
        if(cbFail && typeof cbFail === 'function') cbFail();
        $textarea.focus()
    }
  
  };
  
  // ACTIONS
  
  var action = {
    fs : function() {
      newWidth = $('#wrapper').width()
      if(!options.fs) {
        $('#canvas').removeClass('canvas').addClass('canvas-fs').attr('width',newWidth);
        $('#textarea-wrapper').hide();
      } else {
        newWidth /= 2;
        $('#canvas').addClass('canvas').removeClass('canvas-fs').attr('width',newWidth);
        $('#textarea-wrapper').show();
      }
      Math.width = newWidth;
      Math.midWidth = newWidth/2;
      window.paper.setDimension({
        width : Math.width,
        midWidth : Math.midWidth
      });
      options.fs = !options.fs;
      action.exec();
    },
    exec : function() {
      try {
        cancelAnimationFrame(Math._id); // Cancel the requestAnimationFrame
        paper.clear();  // Clear the canvas
        Math._tick = 0; // Reset the timer
        Math._x = 0;    // Reset the x,y
        Math._y = 0;
        var code = codeMirror.getValue(); // The content of the textarea
        if(code.match(/^#graph(.)*/g)) {
          code = code.replace(/#graph/g,'');
          Function(';with(Math){\
                              line(0,midHeight,width,midHeight);\
                              line(midWidth-8.5,0,midWidth-8.5,height);\
                              };')();
        }
        Math._f = Function(';with(Math){'+code+'};')(); // DONT DO THIS AT HOME !!!!! WITH+EVAL = VOLDEMORT
        $('#error').fadeOut();
        $('#good').fadeIn();
      } catch(e) {
        $('#error').fadeIn();
        $('#good').fadeOut();
        console.log(e);
      }
    }
  }
  
  // KEYS
  
  // ctrl flag
  var ctrl = false,
      done = false;
  
  $('*').keydown(function(e) {
    // toggle of the ctrl flag
    if(e.keyCode == 17 || e.keyCode == 91) {
      ctrl = true;
    } else {
      if(ctrl) {
        // if ctrl && r
        if(e.keyCode == 82 || e.keyCode == 13) {
          e.preventDefault();
          if(!done) {
            done = true;
            action.exec();
          }
        // if ctrl && h
        } else if(e.keyCode == 72)  {
          e.preventDefault();
          if(!done) {
            done = true;
            action.fs();
          }
        }
      } 
    }
  });
  
  // We toggle of the ctrl flag
  $('*').keyup(function(e) {
    if(e.keyCode == 17 || e.keyCode == 91) {
      ctrl = false;
      done = false;
    } 
  });
  
  // MOUSE
  
  $('#canvas').click(function(e){
    Math._x = e.offsetX;
    Math._y = e.offsetY;
  });
};

