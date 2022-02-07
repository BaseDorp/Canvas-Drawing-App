const canvas = document.getElementById("drawing-board");
const context = canvas.getContext("2d");

let outputField = document.getElementById("outputText");
let sizeSlider = document.getElementById("sizeSlider");
let colorInput = document.getElementById("colorInput");

// Resets the line being drawn whenever the color or brush size is changed
sizeSlider.addEventListener("input", ()=>{
    context.beginPath();
})
colorInput.addEventListener("input", ()=>{
    context.beginPath();
})

// Changes which tool the user has selected
let toolSelected = "Paint";
function ToolChange(toolName){
    outputField.innerText = toolName + " Tool Selected";
    toolSelected = toolName;
}

// path - a Path2D object // style - stroke style value
function Shape(path, style){
    this.path = path;
    this.style = style;
};

// history of paths drawn to the canvas
let history = [];

let newPath = new Path2D();
context.beginPath();
let painting = false;
canvas.addEventListener('mousedown', (e) => {
    // Get mouse position on the canvas relative to the screen space
    let mouseX = e.clientX - canvas.getBoundingClientRect().left;
    let mouseY = e.clientY - canvas.getBoundingClientRect().top;
    let startX = mouseX;
    let startY = mouseY;

    // set color
    // context.fillStyle = colorInput.value;
    // context.strokeStyle = colorInput.value;

    switch (toolSelected)
    {
        case "Paint":
            painting = true;
            // draw(e);
            break;
        case "Fill":

            break;
        case "Line":
            context.lineWidth = sizeSlider.value;
            context.lineJoin = "round";
            context.lineCap = "round";
            context.strokeStyle = colorInput.value;

            // let newLine = new Path2D();
            // newLine.lineTo(mouseX, mouseY);
            // context.stroke(newLine);
            // history.push(new Shape(newLine, colorInput.value));
            
            
            context.lineTo(mouseX, mouseY);
            context.stroke();

            break;
        case "Circle":
            let newCircle = new Path2D();
            newCircle.arc(mouseX, mouseY, sizeSlider.value, 0, 360);
            context.strokeStyle = colorInput.value;
            context.stroke(newCircle);
            history.push(new Shape(newCircle, colorInput.value));
            break;
        case "Square":
            let newSqaure = new Path2D();
            newSqaure.rect(mouseX - sizeSlider.value/2, mouseY - sizeSlider.value/2, sizeSlider.value, sizeSlider.value)
            context.strokeStyle = colorInput.value;
            context.stroke(newSqaure);
            history.push(new Shape(newSqaure, colorInput.value));
            break;
    }
});

// 
canvas.addEventListener("mouseup", () => {
    painting = false;
});
canvas.addEventListener("mousemove", (e)=>{
    if (!painting) return;

    // paint styling
    context.beginPath();
    context.strokeStyle = colorInput.value;
    context.lineWidth = sizeSlider.value;
    context.lineCap = "round";

    context.lineTo(e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top);
    context.stroke();
    context.beginPath();
    context.moveTo(e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top);
});

// function draw(e)
// {
    
// }

// Removes the last object drawn and redraws the canvas
function Undo(){
    if (history.length == 0) return;
    history.pop();
    UpdateCanvas();
}

function Redo(){

}

// Erases the canvas and redraws the canvas from the array of drawn objects
function UpdateCanvas(){
    ClearCanvas();
    for (let i = 0; i < history.length; i++){
        context.strokeStyle = history[i].style;
        context.stroke(history[i].path);
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