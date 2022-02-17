const canvas = document.getElementById("drawing-board");
const context = canvas.getContext("2d");

let outputField = document.getElementById("outputText");
let sizeSlider = document.getElementById("sizeSlider");
let colorInput = document.getElementById("colorInput");

// Resets the line being drawn whenever the color or brush size is changed
sizeSlider.addEventListener("input", ()=>{
    context.beginPath();
    newLine = new Path2D();
})
colorInput.addEventListener("input", ()=>{
    context.beginPath();
    newLine = new Path2D();
})

// Changes which tool the user has selected
let toolSelected = "Paint";
function ToolChange(toolName){
    outputField.innerText = toolName + " Tool Selected";
    toolSelected = toolName;
    newLine = new Path2D();
}

// path - a Path2D object // style - stroke style value // type - type of shape (Square or Circle) //
function Shape(path, style, type){
    this.path = path;
    this.style = style;
    this.type = type;
};
function Drawing(points, style, size, type){
    this.points = points;
    this.style = style;
    this.size = size;
    this.type = type;
}
function Point(X, Y){
    this.X = X;
    this.Y = Y;
}

// history of paths drawn to the canvas
let history = [];
let points = [];

let newPath = new Path2D();
let newLine = new Path2D();
context.beginPath();
let painting = false;
canvas.addEventListener('mousedown', (e) => {
    // Get mouse position on the canvas relative to the screen space
    let mouseX = e.clientX - canvas.getBoundingClientRect().left;
    let mouseY = e.clientY - canvas.getBoundingClientRect().top;

    // set color
    // context.fillStyle = colorInput.value;
    // context.strokeStyle = colorInput.value;

    switch (toolSelected)
    {
        case "Paint":
            painting = true;
            draw(e);
            break;
        case "Fill":

            break;
        case "Line":
            context.lineWidth = sizeSlider.value;
            context.lineJoin = "round";
            context.lineCap = "round";
            context.strokeStyle = colorInput.value;

            newLine.lineWidth = sizeSlider.value;
            newLine.lineTo(mouseX, mouseY);
            context.stroke(newLine);
            history.push(new Shape(newLine, colorInput.value));

            break;
        case "Circle":
            let newCircle = new Path2D();
            newCircle.arc(mouseX, mouseY, sizeSlider.value, 0, 360);
            context.strokeStyle = colorInput.value;
            context.stroke(newCircle);
            history.push(new Shape(newCircle, colorInput.value, "Circle"));
            break;
        case "Square":
            let newSqaure = new Path2D();
            newSqaure.rect(mouseX - sizeSlider.value/2, mouseY - sizeSlider.value/2, sizeSlider.value, sizeSlider.value)
            context.strokeStyle = colorInput.value;
            context.stroke(newSqaure);
            history.push(new Shape(newSqaure, colorInput.value, "Square"));
            break;
    }
});

// 
canvas.addEventListener("mouseup", () => {
    if (!painting) return;
    painting = false;
    history.push(new Drawing(points, colorInput.value, sizeSlider.value, "Paint"));
    points = [];
    newPath = new Path2D();
});
canvas.addEventListener("mousemove", draw);

function draw(e)
{
    if (!painting) return;

    // Get mouse position on the canvas relative to the screen space
    let mouseX = e.clientX - canvas.getBoundingClientRect().left;
    let mouseY = e.clientY - canvas.getBoundingClientRect().top;

    // paint styling
    newPath = new Path2D();
    context.strokeStyle = colorInput.value;
    context.lineWidth = sizeSlider.value;
    context.lineCap = "round";

    // context.beginPath();
    // context.lineTo(mouseX, mouseY);
    // context.stroke();
    // context.beginPath();
    // context.moveTo(mouseX, mouseY);
    newPath.lineTo(mouseX, mouseY);
    points.push(new Point(mouseX, mouseY));
    context.stroke(newPath);
}

// Removes the last object drawn and redraws the canvas
function Undo(){
    if (history.length == 0) return;
    // newLine = new Path2D();
    ClearCanvas();
    history.pop();
    UpdateCanvas();
    
    console.log(history);
}

function Redo(){

}

// Erases the canvas and redraws the canvas from the array of drawn objects
function UpdateCanvas(){
    ClearCanvas();
    for (let i = 0; i < history.length; i++){
        context.lineCap = "round";
        context.strokeStyle = history[i].style;
        context.lineWidth = history[i].size;

        if (history[i].type == "Square" || history[i].type == "Circle"){
            context.lineWidth = 1;
            context.stroke(history[i].path);
        }

        // TODO WORK WITH LINES
        

        if (history[i].type == "Paint"){
            for (let j = 0; j < history[i].points.length; j++){
                context.beginPath();
                context.lineTo(history[i].points[j].X, history[i].points[j].Y);
                context.stroke();
            }
        }
        
    }
}

// Wipes the canvas clean
function ClearCanvas(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawingLine = false;
}

// Creates a new canvas layer
function NewLayer(){

}