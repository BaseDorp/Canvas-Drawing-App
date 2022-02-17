const canvas = document.getElementById("drawing-board");
const context = canvas.getContext("2d");

let outputField = document.getElementById("outputText");
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
  outputField.innerText = toolName + " Tool Selected";
  toolSelected = toolName;
  context.beginPath();
}

// path - a Path2D object // style - stroke style value // type - type of shape (Square or Circle) //
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

// history of paths drawn to the canvas
let history = [];
let points = [];

let newPath = new Path2D();
let painting = false;
context.lineJoin = "round";
context.lineCap = "round";

canvas.addEventListener("mousedown", (e) => {
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
});

//
canvas.addEventListener("mouseup", () => {
  if (!painting) return;
  painting = false;
  history.push(new Shape(points, colorInput.value, "Paint", sizeSlider.value));
  points = [];
  newPath = new Path2D();
});
canvas.addEventListener("mousemove", draw);

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
    else if (history[i].type == "Line"){
        context.lineTo(history[i].path.X, history[i].path.Y);
        context.stroke();
    }
  }
}

// Wipes the canvas clean
function ClearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawingLine = false;
  context.beginPath();
}

// Creates a new canvas layer
function NewLayer() {
    
}