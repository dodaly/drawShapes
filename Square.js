
var gl;
var delay = 100;
var keyPushed = 1;
var isMouseDown = false;
var	length = 0;
var length_l = 0;
var length_t = 0;
var drawingpoint = false;
var findingpoint = false;
var print;
var wxmin;
var wymin;
var wxmax;
var wymax;
var accepted = false;
var vertices_remaining = 0;
const action = {
    DRAWPOINT: '0',
    DRAWLINE: '1',
    DRAWTRIANGLE: '2',
    FIND: '3'
}
var cur_action;
window.onload = function init() {

    var canvas = document.getElementById( "gl-canvas" );
    var demo = document.getElementById( "demo" );
    gl = WebGLUtils.setupWebGL( canvas );
	var findpoint = document.getElementById( "findpoint" );
	var drawpoint = document.getElementById( "drawpoint" );
	var drawtriangle = document.getElementById( "drawtriangle" );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
	var vColor = gl.getAttribLocation( program, "vColor");
	var vPosition = gl.getAttribLocation( program, "vPosition");
	//declares arrays for points
    var vertices = [length];
	var vertx = [length];
	var verty = [length];
	var indices = [length];
    var colors = [length];
	//declares arrays for lines
	var vertices_l = [length_l];
	var vertx_l = [length_l];
	var verty_l = [length_l];
	var indices_l = [length_l];
    var colors_l = [length_l];
	//declares arrays for triangles
	var vertices_t = [length_t];
	var vertx_t = [length_t];
	var verty_t = [length_t];
	var indices_t = [length_t];
    var colors_t = [length_t];
	//creates all necessary buffers
	var vBuffer = gl.createBuffer();
	var cBuff = gl.createBuffer();
	var vBuffer_t = gl.createBuffer();
	var cBuff_t = gl.createBuffer();
    window.onkeydown = function(event) {
        var key = String.fromCharCode(event.keyCode);
        switch(key) {
          case '1':
				keyPushed = 1;
            break;

          case '2':
				keyPushed = 2;
            break;

          case '3':
            	keyPushed = 3;
            break;
		  case '4':
            	keyPushed = 4;
            break;
        }
    };
	drawpoint.onclick = function(event){
		// when draw point button is clicked switch to drawing point state, and out of finding point state
		cur_action = action.DRAWPOINT;
	}
	drawline.onclick = function(event){
		// when draw point button is clicked switch to drawing point state, and out of finding point state
		cur_action = action.DRAWLINE;
	}
	drawtriangle.onclick = function(event){
		// when draw point button is clicked switch to drawing point state, and out of finding point state
		cur_action = action.DRAWTRIANGLE;
	}
	findpoint.onclick = function(event){
		// when find point button is clicked switch to findinging point state, and out of drawing point state
		cur_action = action.FIND;
	}
	accept.onclick = function(event){
		// sets the world coords when the user clicks the accept button
		wxmin = document.getElementById("WX_min").value;
        wymin = document.getElementById("WY_min").value;
        wxmax = document.getElementById("WX_max").value;
        wymax = document.getElementById("WY_max").value;
		var wcLoc = gl.getUniformLocation(program, "wc_holder");
	    gl.uniform4fv(wcLoc, [Number(wxmin), Number(wxmax), Number(wymin), Number(wymax)]);
		//so that the program wont work untill the accept button has been clicked
		accepted = true;
	}
	canvas.onclick = function(event) {
	if (accepted == true){
	var x = event.clientX-8;
    var y = event.clientY-8;
	

	var wc_x = ((wxmax-wxmin)*(x/canvas.width) + Number(wxmin));
    var wc_y = ((wymax-wymin)*(y/canvas.height) + Number(wymin));
	wc_y = (Number(wymax)+Number(wymin))/2 - (wc_y - (Number(wymax)+Number(wymin))/2);
	if (cur_action == action.DRAWPOINT)
	{
	//sets the next element in each array to the correct value
		vertices[length] = vec2(wc_x, wc_y);
		vertx[length] = wc_x;
		verty[length] = wc_y;
		colors [length] = vec4 (1.0, 0, 0, 1.0);

		indices[length] = (length);
		console.log(vertices[length]);
		//sends the vertices to gl
		
		
		length++;
		render();
	}
	if (cur_action == action.DRAWLINE)
	{
		//sets the next element in each array to the correct value
		vertices_l[length_l] = vec2(wc_x, wc_y);
		vertx_l[length_l] = wc_x;
		verty_l[length_l] = wc_y;
		colors_l [length_l] = vec4 (1.0, 0, 0, 1.0);
		indices_l[length_l] = (length_l);
		console.log(vertices_l[length_l]);
		//sends the vertices to gl
		
		
		length_l++;
		render();
	}
	if (cur_action == action.DRAWTRIANGLE)
	{
		if (vertices_remaining == 0)
		{
		vertices_remaining = 3;
		}
		//sets the next element in each array to the correct value
		vertices_t[length_t] = vec2(wc_x, wc_y);
		vertx_t[length_t] = wc_x;
		verty_t[length_t] = wc_y;
		if (vertices_remaining == 3){
		colors_t [length_t] = vec4 (1.0, 0, 0, 1.0);
		}
		if (vertices_remaining == 2){
		colors_t [length_t] = vec4 (0, 1.0, 0, 1.0);
		}
		if (vertices_remaining == 1){
		colors_t [length_t] = vec4 (0, 0, 1.0, 1.0);
		}
		indices_t[length_t] = (length_t);
		console.log(vertices_t[length_t]);
		//sends the vertices to gl
		
		vertices_remaining--;
		length_t++;
		render();
	}
	if (cur_action == action.FIND)
	{
		// loop through all of the elements in the array of points
		for (i = 0; i < length; i++)
		{
			if (wc_x + 5 >= vertx[i] && wc_x - 5 <= vertx[i] && wc_y + 5 >= verty[i] && wc_y - 5 <= verty[i])
			{
				//print the index and type of selected point
				print = "found point: (" + i + ")";
				document.getElementById("demo").innerHTML = print;
			}
		}
		for (i = 0; i < length_l; i++)
		{
			if (wc_x + 5 >= vertx_l[i] && wc_x - 5 <= vertx_l[i] && wc_y + 5 >= verty_l[i] && wc_y - 5 <= verty_l[i])
			{
				//print the index and type of selected point
				print = "found endpoint of line: (" + i + ")";
				document.getElementById("demo").innerHTML = print;
			}
		}
		for (i = 0; i < length_t; i++)
		{
			if (wc_x + 5 >= vertx_t[i] && wc_x - 5 <= vertx_t[i] && wc_y + 5 >= verty_t[i] && wc_y - 5 <= verty_t[i])
			{
				//print the index and type of selected point
				print = "found vertex of triangle: (" + i + ")";
				document.getElementById("demo").innerHTML = print;
			}
		}
	}
	} else {
		//if WC hasnt been passed yet, prompt user to pass WC
		print = "please click the accept button to pass in the world coordinates";
		document.getElementById("demo").innerHTML = print;
		
	}
	}


function render() {
	gl.clear( gl.COLOR_BUFFER_BIT );
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
	
	// specifies the vertex attribute information
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);

	// enable this attribute, with the given attribute name
	gl.enableVertexAttribArray(vPosition);
	// sends all of the color data to GL
		
	gl.bindBuffer(gl.ARRAY_BUFFER, cBuff);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vColor);
	//initializes the array buffer
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
	// sends all the buffer data to GL
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
	//draws the points
	
	gl.drawElements(gl.POINTS, length, gl.UNSIGNED_SHORT, 0);
	
	// begin section for lines
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices_l), gl.STATIC_DRAW);

	// sends all of the color data to GL
	gl.bindBuffer(gl.ARRAY_BUFFER, cBuff);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(colors_l), gl.STATIC_DRAW);
	// sends all the buffer data to GL
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices_l), gl.STATIC_DRAW);
	gl.drawElements(gl.LINES, length_l, gl.UNSIGNED_SHORT, 0);
	
	//start section for triangles
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices_t), gl.STATIC_DRAW);


	// sends all of the color data to GL
	gl.bindBuffer(gl.ARRAY_BUFFER, cBuff);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(colors_t), gl.STATIC_DRAW);
	// sends all the buffer data to GL
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices_t), gl.STATIC_DRAW);
	gl.drawElements(gl.TRIANGLES, length_t, gl.UNSIGNED_SHORT, 0);
}
};
