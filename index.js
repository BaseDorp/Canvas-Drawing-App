// get canvas and context
let canvasArray = document.getElementsByClassName("canvas-layer");
let canvas = canvasArray[0];
let context = canvas.getContext("2d");

let history = []; // history of paths drawn to the canvas
let historyArray = [history]; // array of histories with the index corrisponding to the canvasArray

const layerContainer = document.getElementById("layers-container")
const canvasContainer = document.getElementById("canvas-container");

// Change currently selected layer
let currentLayer;
let layerButtons = document.getElementsByClassName("layer");
function ChangeLayer(layer) {
    // remove current even listeners
    canvasContainer.removeEventListener("mousemove", draw);
    canvasContainer.removeEventListener("mousedown", mouseDown);
    
    currentLayer = layer;

    // Updates which layer the user is trying to draw on
    canvas = canvasArray[currentLayer];
    context = canvas.getContext("2d");

    // re add event listeners to newly selected canvas
    canvasContainer.addEventListener("mousedown", mouseDown);
    canvasContainer.addEventListener("mousemove", draw);

    for(let i = 0; i < layerButtons.length; i++){
        layerButtons[i].style.backgroundColor = "darkgray";
    }
    layerButtons[(layerButtons.length - layer - 1)].style.backgroundColor = "lightblue";
}
ChangeLayer(0);

// 
let sizeSlider = document.getElementById("sizeSlider");
let colorInput = document.getElementById("colorInput");

// Resets the line being drawn whenever the color or brush size is changed
sizeSlider.addEventListener("input", () => {
    context.beginPath();
});
colorInput.addEventListener("input", () => {
    context.beginPath();
});

let toolButtons = document.getElementsByClassName("tool");
// Changes which tool the user has selected
let toolSelected;
function ToolChange(toolName) {

    toolSelected = toolName;
    context.beginPath();

    for(let i = 0; i < toolButtons.length; i++){
        if (toolButtons[i].innerHTML == toolName)
        {
            toolButtons[i].style.backgroundColor = "lightblue";
        }
        else{
            toolButtons[i].style.backgroundColor = "white";
        }
    }
}
ToolChange("Paint");

// path - either a Path2D object or points making up the shape
// style - stroke color value 
// type - type of shape (Square, Circle, Line or Paint) 
// size - line width for lines and painting
function Shape(path, style, type, size) {
    this.path = path;
    this.style = style;
    this.type = type;
    this.size = size;
}

function Point(X, Y) {
    this.X = X;
    this.Y = Y;
}

context.lineJoin = "round";
context.lineCap = "round";

let points = []; // List of points in the current stroke for Painting
let newPath = new Path2D();
let painting = false;

// get event from document instead of canvas incase the user lets go of the mouse drawing off of the canvas
document.addEventListener("mouseup", () => {
    if (!painting) return;

    painting = false;
    // creates the shape with all the points in the stroke
    historyArray[currentLayer].push(new Shape(points, colorInput.value, "Paint", sizeSlider.value));
    points = [];
    newPath = new Path2D();
    context.beginPath();
});

canvasContainer.addEventListener("mousedown", mouseDown);
canvasContainer.addEventListener("mousemove", draw);

function mouseDown(e) {
    // Get mouse position on the canvas relative to the screen space
    let mouseX = e.clientX - canvas.getBoundingClientRect().left;
    let mouseY = e.clientY - canvas.getBoundingClientRect().top;
    context.strokeStyle = colorInput.value;
    switch (toolSelected) {
        case "Paint":
            painting = true;
            draw(e);
            break;
        case "Line":
            context.lineWidth = sizeSlider.value;
            context.strokeStyle = colorInput.value;

            context.lineTo(mouseX, mouseY);
            context.stroke();
            historyArray[currentLayer].push(new Shape(new Point(mouseX, mouseY), colorInput.value, "Line", sizeSlider.value));
            break;
        case "Circle":
            let newCircle = new Path2D();
            context.lineWidth = 1;
            newCircle.arc(mouseX, mouseY, sizeSlider.value, 0, 360);

            context.stroke(newCircle);
            historyArray[currentLayer].push(new Shape(newCircle, colorInput.value, "Circle"));
            break;
        case "Square":
            let newSqaure = new Path2D();
            context.lineWidth = 1;
            newSqaure.rect(
                mouseX - sizeSlider.value / 2,
                mouseY - sizeSlider.value / 2,
                sizeSlider.value,
                sizeSlider.value
            );
            context.stroke(newSqaure);
            historyArray[currentLayer].push(new Shape(newSqaure, colorInput.value, "Square"));
            break;
    }
}

function draw(e) {
    if (!painting) return;

    // Get mouse position on the canvas relative to the screen space
    let mouseX = e.clientX - canvas.getBoundingClientRect().left;
    let mouseY = e.clientY - canvas.getBoundingClientRect().top;

    // paint styling
    newPath = new Path2D();
    context.strokeStyle = colorInput.value;
    context.lineWidth = sizeSlider.value;
    context.lineCap = "round";

    newPath.lineTo(mouseX, mouseY);
    points.push(new Point(mouseX, mouseY));
    context.stroke(newPath);
}

// Removes the last object drawn and redraws the canvas
function Undo() {
    if (historyArray[currentLayer].length == 0) return;
    ClearCanvas();
    historyArray[currentLayer].pop();
    UpdateCanvas();
}

// Erases the canvas and redraws the canvas from the array of drawn objects
function UpdateCanvas() {
    ClearCanvas();
    for (let i = 0; i < historyArray[currentLayer].length; i++) {
        context.lineCap = "round";
        context.strokeStyle = historyArray[currentLayer][i].style;
        context.lineWidth = historyArray[currentLayer][i].size;

        if (historyArray[currentLayer][i].type == "Square" || historyArray[currentLayer][i].type == "Circle") {
            context.lineWidth = 1;
            context.stroke(historyArray[currentLayer][i].path);
        }
        else if (historyArray[currentLayer][i].type == "Paint") {
            for (let j = 0; j < historyArray[currentLayer][i].path.length; j++) {
                context.beginPath();
                context.lineTo(historyArray[currentLayer][i].path[j].X, historyArray[currentLayer][i].path[j].Y);
                context.stroke();
            }
        }
        else if (historyArray[currentLayer][i].type == "Line") {
            if (i <= 1){
                // Edge case where the line would draw from the end of a point of another drawing when undoing
                context.moveTo(historyArray[currentLayer][i].path.X, historyArray[currentLayer][i].path.Y)
            }
            context.lineTo(historyArray[currentLayer][i].path.X, historyArray[currentLayer][i].path.Y);
            context.stroke();
        }
    }
}

// Wipes the canvas clean
function ClearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
}

// Creates a new canvas layer
function NewLayer() {
    canvasContainer.innerHTML += '<canvas class="canvas-layer" width="720px" height="480px"></canvas>';
    canvasArray = document.querySelectorAll('[class=canvas-layer]');

    let temphtml = layerContainer.innerHTML;
    layerContainer.innerHTML = '<div class="layer"><button class="hide-button" onclick="HideLayer('+ (canvasArray.length-1) +')">Hide</button><button class="layer-button" onclick="ChangeLayer('+ (canvasArray.length-1) +')">Layer '+ (canvasArray.length-1) +'</button><button onclick="DeleteLayer('+ (canvasArray.length-1) +')">Delete</button></div>';
    layerContainer.innerHTML += temphtml;

    // add an array for the history of the new layer
    historyArray.push([]);

    // redraw the canvas's after the 
    for (let i = 0; i < canvasArray.length; i++){
        ChangeLayer(i);
        UpdateCanvas();
    }

    ChangeLayer(currentLayer);
}

// Delete that layer
function DeleteLayer(layer) {
    if (canvasArray.length <= 1) return;
    // remove the canvas from the array and change the num of layers 
    canvasArray = Array.from(canvasArray);
    canvasArray.pop();
    historyArray.splice((layer), 1);
    

    // if deleting the current layer, change to the next top layer
    // if (currentLayer >= canvasArray.length-1) ChangeLayer(canvasArray-2);

    // Update the html
    canvasContainer.innerHTML = "";
    layerContainer.innerHTML = "";
    for (let i = (canvasArray.length-1); i >= 0; i--) {
        canvasContainer.innerHTML += '<canvas class="canvas-layer" width="720px" height="480px"></canvas>';

        layerContainer.innerHTML += "<div class='layer'><button class='hide-button' onclick='HideLayer(" + i + ")')>Hide</button><button class='layer-button' onclick='ChangeLayer(" + i + ")' >Layer " + i + "</button><button onclick='DeleteLayer(" + i + ")'>Delete</button></div>";
        // layerContainer.innerHTML = '<div class="layer"><button class="hide-button" onclick="HideLayer('+ i +')">Hide</button><button class="layer-button" onclick="ChangeLayer('+ i +')">Layer '+ i +'</button><button onclick="DeleteLayer('+ i +')">Delete</button></div>';
    }
    canvasArray = document.querySelectorAll('[class=canvas-layer]');

    layerContainer.innerHTML += '<button class="new-layer" onclick="NewLayer()">New Layer</button>';

    // redraw the canvas's after the 
    for (let i = 0; i < canvasArray.length; i++){
        ChangeLayer(i);
        UpdateCanvas();
    }


    ChangeLayer(0);
}

let hideButtons = document.getElementsByClassName("hide-button");
// Change visibility of a layer
function HideLayer(layer) {
    if (canvasArray[layer].style.visibility == "hidden") {
        canvasArray[layer].style.visibility = "visible";
        // hideButtons[layer].style.backgroundColor = "white";
        return;
    }
    canvasArray[layer].style.visibility = "hidden";
    // layerContainer[layer].style.backgroundColor = "darkgray";
}

function Save() {
    // TODO
}

