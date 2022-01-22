const canvas = document.getElementById("gameScreen");
const context = canvas.getContext("2d");

let outputField = document.getElementById("outputText");
let redSlider = document.getElementById("redSlider");
let greenSlider = document.getElementById("greenSlider");
let blueSlider = document.getElementById("blueSlider");
let sizeSlider = document.getElementById("sizeSlider");

let PaintTool = true;
let FillTool = false;
let LineTool = false;
let CircleTool = false;
let SquareTool = false;


function ToolChange(toolName){
    switch (toolName){
        case "Paint":
            PaintTool = true;
            FillTool = false;
            LineTool = false;
            CircleTool = false;
            SquareTool = false;
            break;
        case "Fill":
            PaintTool = false;
            FillTool = true;
            LineTool = false;
            CircleTool = false;
            SquareTool = false;
            break;
        case "Line":
            PaintTool = false;
            FillTool = false;
            LineTool = true;
            CircleTool = false;
            SquareTool = false;
            break;
        case "Circle":
            PaintTool = false;
            FillTool = false;
            LineTool = false;
            CircleTool = true;
            SquareTool = false;
            break;
        case "Square":
            PaintTool = false;
            FillTool = false;
            LineTool = false;
            CircleTool = false;
            SquareTool = true;
            break;
    }
    outputField.innerText = toolName + " Tool Selected";
}

redSlider.addEventListener("input", () => {
    
});


let drawingShape = false;

canvas.addEventListener('mousedown', (e) => {
    let mouseX = e.clientX - canvas.getBoundingClientRect().left;
    let mouseY = e.clientY - canvas.getBoundingClientRect().top;
    let startX = mouseX;
    let startY = mouseY;

    // Get color from rgb sliders
    context.fillStyle = `rgb(${redSlider.value}, ${greenSlider.value}, ${blueSlider.value})`;

    if (PaintTool)
    {
        context.lineWidth = 10;
        context.lineCap = "round";

        
        
    }
    else if (FillTool)
    {
        
    }
    else if (LineTool)
    {
        if (!drawingShape){
            context.beginPath();
            drawingShape = true;
        }
        context.lineTo(mouseX, mouseY);
        context.stroke();
    }
    else if (CircleTool)
    {
        // canvas.addEventListener('mouseup', (e) => {
        //     mouseX = e.clientX - canvas.getBoundingClientRect().left;
        //     mouseY = e.clientY - canvas.getBoundingClientRect().top;
        //     context.beginPath();
        //     context.arc(mouseX, mouseY, Math.abs(startX - mouseX), 0, 360);
        //     context.stroke();
        //     context.fill();
        // })
        context.beginPath();
        context.arc(mouseX, mouseY, sizeSlider.value, 0, 360);
        context.stroke();
        context.fill();
    }
    else if (SquareTool)
    {
        // canvas.addEventListener('mouseup', (e) => {
        //     mouseX = e.clientX - canvas.getBoundingClientRect().left;
        //     mouseY = e.clientY - canvas.getBoundingClientRect().top;
        //     context.fillRect(startX, startY, startX - mouseX, startY - mouseY);
        //     console.log(Math.abs(mouseX - startX), Math.abs(mouseY - startY));
        // })
        context.fillRect(mouseX - sizeSlider.value/2, mouseY - sizeSlider.value/2, sizeSlider.value, sizeSlider.value);
    }
});

window.addEventListener('mouseup', (endPosition) => {

});

function ClearCanvas(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawingShape = false;
}