const canvas = document.getElementById("drawing-board");
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

// sets div to the rbg values of the sliders
let colorPreview = document.getElementById("color-preview");
colorPreview.style.backgroundColor = `rgb(${redSlider.value}, ${greenSlider.value}, ${blueSlider.value})`;

function updateColorPreview()
{
    colorPreview.style.backgroundColor = `rgb(${redSlider.value}, ${greenSlider.value}, ${blueSlider.value})`;

    context.beginPath();
}
sizeSlider.addEventListener("input", ()=>{
    context.beginPath();
})

// Changes which tool the user has selected
let toolSelected = "Paint";
function ToolChange(toolName){
    outputField.innerText = toolName + " Tool Selected";
    toolSelected = toolName;
}

let painting = false;

context.beginPath();
canvas.addEventListener('mousedown', (e) => {
    // Get mouse position on the canvas relative to the screen space
    let mouseX = e.clientX - canvas.getBoundingClientRect().left;
    let mouseY = e.clientY - canvas.getBoundingClientRect().top;
    let startX = mouseX;
    let startY = mouseY;

    // Get color from rgb sliders
    context.fillStyle = `rgb(${redSlider.value}, ${greenSlider.value}, ${blueSlider.value})`;

    switch (toolSelected)
    {
        case "Paint":
            painting = true;
            draw(e);
            break;

        case "Fill":

            break;

        case "Line":
            context.strokeStyle = `rgb(${redSlider.value}, ${greenSlider.value}, ${blueSlider.value})`;
            context.lineWidth = sizeSlider.value;
            context.lineJoin = "round";
            context.lineCap = "round";
            
            context.lineTo(mouseX, mouseY);
            context.stroke();
            break;

        case "Circle":
            context.lineWidth = 0;
            context.beginPath();
            context.arc(mouseX, mouseY, sizeSlider.value, 0, 360);
            context.fill();
            break;

        case "Square":
            context.fillRect(mouseX - sizeSlider.value/2, mouseY - sizeSlider.value/2, sizeSlider.value, sizeSlider.value);
            break;
    }
});

// 
canvas.addEventListener("mouseup", () => {
    if (toolSelected == "Paint"){
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

//
function ClearCanvas(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawingLine = false;
}