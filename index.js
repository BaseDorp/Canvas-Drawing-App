const canvas = document.getElementById("gameScreen");
const context = canvas.getContext("2d");

let outputField = document.getElementById("outputText");
let sizeSlider = document.getElementById("sizeSlider");


// Gets the values from the RBG sliders and creates a preview color
let redSlider = document.getElementById("redSlider");
let greenSlider = document.getElementById("greenSlider");
let blueSlider = document.getElementById("blueSlider");
redSlider.addEventListener("input", updateColorPreview)
greenSlider.addEventListener("input", updateColorPreview)
blueSlider.addEventListener("input", updateColorPreview)

let colorPreview = document.getElementById("color-preview");
colorPreview.style.backgroundColor = `rgb(${redSlider.value}, ${greenSlider.value}, ${blueSlider.value})`;

function updateColorPreview()
{
    colorPreview.style.backgroundColor = `rgb(${redSlider.value}, ${greenSlider.value}, ${blueSlider.value})`;
}

//
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

// 
let painting = false;
let drawingLine = false;

canvas.addEventListener('mousedown', (e) => {
    let mouseX = e.clientX - canvas.getBoundingClientRect().left;
    let mouseY = e.clientY - canvas.getBoundingClientRect().top;
    let startX = mouseX;
    let startY = mouseY;

    // Get color from rgb sliders
    context.fillStyle = `rgb(${redSlider.value}, ${greenSlider.value}, ${blueSlider.value})`;

    if (PaintTool)
    {
        painting = true;
        draw(e);
    }
    else if (FillTool)
    {
        
    }
    else if (LineTool)
    {
        if (!drawingLine){
            context.beginPath();
            drawingLine = true;
        }
        context.strokeStyle = `rgb(${redSlider.value}, ${greenSlider.value}, ${blueSlider.value})`;
        context.lineWidth = sizeSlider.value;
        context.lineTo(mouseX, mouseY);
        context.stroke();
    }
    else if (CircleTool)
    {
        context.lineWidth = 0;
        context.beginPath();
        context.arc(mouseX, mouseY, sizeSlider.value, 0, 360);
        context.stroke();
        context.fill();
    }
    else if (SquareTool)
    {
        context.fillRect(mouseX - sizeSlider.value/2, mouseY - sizeSlider.value/2, sizeSlider.value, sizeSlider.value);
    }
});

// 
canvas.addEventListener("mouseup", () => {
    if (PaintTool == true){
    context.beginPath();
    painting = false;
    }
});
canvas.addEventListener("mousemove", draw);

function draw(e)
{
    if (!painting) return;

    // paint styling
    context.beginPath();
    context.strokeStyle = `rgb(${redSlider.value}, ${greenSlider.value}, ${blueSlider.value})`;
    context.lineWidth = sizeSlider.value;
    context.lineCap = "round";

    context.lineTo(e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top);
    context.stroke();
    context.beginPath();
    context.moveTo(e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top);
}

function ClearCanvas(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawingShape = false; // TODO dont think i need these
    drawingLine = false;
}