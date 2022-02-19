// get canvas and context
let canvasArray = document.getElementsByClassName("canvas-layer");
let canvas = canvasArray[0];
let context = canvas.getContext("2d");

let history = []; // history of paths drawn to the canvas

const layerContainer = document.getElementById("layers-container")
const canvasContainer = document.getElementById("canvas-container");

// Change currently selected layer
let currentLayer = 1;
function ChangeLayer(layer) {
    // remove current even listeners
    // canvas.removeEventListener("mousemove", draw);
    // canvas.removeEventListener("mousedown", mouseDown);

    currentLayer = layer;

    // Updates which layer the user is trying to draw on
    canvas = canvasArray[layer - 1];
    context = canvas.getContext("2d");

    // re add event listeners to newly selected canvas
    canvas.addEventListener("mousedown", mouseDown);
    canvas.addEventListener("mousemove", draw);
}

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

// Changes which tool the user has selected
let toolSelected = "Paint";
function ToolChange(toolName) {
    toolSelected = toolName;
    context.beginPath();
}

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
    history.push(new Shape(points, colorInput.value, "Paint", sizeSlider.value));
    points = [];
    newPath = new Path2D();
});

document.addEventListener("mousedown", mouseDown);
document.addEventListener("mousemove", draw);

function mouseDown(e) {
    // Get mouse position on the canvas relative to the screen space
    let mouseX = e.clientX - canvas.getBoundingClientRect().left;
    let mouseY = e.clientY - canvas.getBoundingClientRect().top;
console.log(currentLayer);
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
            history.push(new Shape(new Point(mouseX, mouseY), colorInput.value, "Line", sizeSlider.value));
            break;
        case "Circle":
            let newCircle = new Path2D();
            context.lineWidth = 1;
            newCircle.arc(mouseX, mouseY, sizeSlider.value, 0, 360);

            context.stroke(newCircle);
            history.push(new Shape(newCircle, colorInput.value, "Circle"));
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
            history.push(new Shape(newSqaure, colorInput.value, "Square"));
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
    if (history.length == 0) return;
    ClearCanvas();
    history.pop();
    UpdateCanvas();
}

// Erases the canvas and redraws the canvas from the array of drawn objects
function UpdateCanvas() {
    ClearCanvas();
    for (let i = 0; i < history.length; i++) {
        context.lineCap = "round";
        context.strokeStyle = history[i].style;
        context.lineWidth = history[i].size;

        if (history[i].type == "Square" || history[i].type == "Circle") {
            context.lineWidth = 1;
            context.stroke(history[i].path);
        }
        else if (history[i].type == "Paint") {
            for (let j = 0; j < history[i].path.length; j++) {
                context.beginPath();
                context.lineTo(history[i].path[j].X, history[i].path[j].Y);
                context.stroke();
            }
        }
        else if (history[i].type == "Line") {
            context.lineTo(history[i].path.X, history[i].path.Y);
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
    canvasContainer.innerHTML += '<canvas class="canvas-layer"  width="720px" height="480px"></canvas>';
    canvasArray = document.querySelectorAll('[class=canvas-layer]');

    let temphtml = layerContainer.innerHTML;
    layerContainer.innerHTML = "<div class='layer'><button onclick='HideLayer(" + canvasArray.length + ")')>Hide</button><button onclick='ChangeLayer(" + canvasArray.length + ")' >Layer " + canvasArray.length + "</button><button onclick='DeleteLayer(" + canvasArray.length + ")'>Delete</button></div>";
    layerContainer.innerHTML += temphtml;
}

// Delete that layer
function DeleteLayer(layer) {
    if (canvasArray.length <= 1) return;
    // remove the canvas from the array and change the num of layers 
    canvasArray = Array.from(canvasArray);
    canvasArray.splice(layer - 1, 1);

    // Update the html
    canvasContainer.innerHTML = "";
    layerContainer.innerHTML = "";
    for (let i = 0; i < canvasArray.length; i++) {
        canvasContainer.innerHTML += '<canvas class="canvas-layer width="720px" height="480px"></canvas>';

        layerContainer.innerHTML += "<div class='layer'><button onclick='HideLayer(" + (canvasArray.length - i) + ")')>Hide</button><button onclick='ChangeLayer(" + (canvasArray.length - i) + ")' >Layer " + (canvasArray.length - i) + "</button><button onclick='DeleteLayer(" + (canvasArray.length - i) + ")'>Delete</button></div>";
    }

    layerContainer.innerHTML += '<button class="new-layer" onclick="NewLayer()">New Layer</button><button onclick="Save()">Save</button>';
}

// Change visibility of a layer
function HideLayer(layer) {
    if (canvasArray[layer - 1].style.visibility == "hidden") {
        canvasArray[layer - 1].style.visibility = "visible";
        return;
    }
    canvasArray[layer - 1].style.visibility = "hidden";
}

function Save() {
    // TODO
}