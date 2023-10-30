// Make instructions more visible and the true function of the back checkbox and it's roll in the strategy.
// fix the respawn location when maze regenerates larger. or fix the multi end cell / startcell stack bug.

// Define the maze generation function
var rowsIn = document.getElementById("heightIn");
// Number of rows
const columnsIn = document.getElementById("widthIn");
var rows = parseInt(rowsIn.value);
var columns = parseInt(columnsIn.value);
// Create a 2D array to represent the maze
var maze = new Array(rows);
var mazecells = new Array(rows);
for (let i = 0; i < rows; i++) {
	maze[i] = new Array(columns).fill(false); // Initially, all cells are unvisited
	mazecells[i] = maze[i];
}
// Function to check if a cell is within the grid
function isValid(x, y) {
	return x >= 0 && x < rows && y >= 0 && y < columns;
}
// Recursive function to generate the maze
function generateMaze(x, y) {
	// Mark the current cell as visited
	maze[x][y] = true;

	// Define possible directions (up, down, left, right)
	const directions = [
		[-2, 0],
		[2, 0],
		[0, -2],
		[0, 2]
	];
	directions.sort(() => Math.random() - 0.5); // Randomize the order

	for (const [dx, dy] of directions) {
		var newX = x + dx;
		var newY = y + dy;

		if (isValid(newX, newY) && !maze[newX][newY]) {
			// Remove the wall between the current cell and the next cell
			maze[x + dx / 2][y + dy / 2] = true;
			generateMaze(newX, newY); // Recursively visit the next cell
		}
	}
}
// Call the generateMaze function with a starting point (top-left corner)
generateMaze(1, 1);
// Mark the end cell as part of the maze path
maze[rows - 2][columns - 2] = true;
function getPlayerColour() {
	var plyrClr = document.getElementById("colourInputStartid");
	var newPlyrClr = plyrClr.value;
	return newPlyrClr;
}
function getPathColour() {
	var pthClr = document.getElementById("colourInputPathid");
	var newPthClr = pthClr.value;
	return newPthClr;
}
function getWallColour() {
	var wallClr = document.getElementById("colourInputWallid");
	var newWllClr = wallClr.value;
	return newWllClr;
}
// Function to generate a new maze and update the grid
function regenerateMaze() {
	// Get the width and height input values
	var widthInput = document.getElementById("widthIn");
	var heightInput = document.getElementById("heightIn");
	var newWidth = parseInt(widthInput.value);
	var newHeight = parseInt(heightInput.value);

	// Check if the input values are valid odd numbers
	if (!isValidOdd(newWidth) || !isValidOdd(newHeight)) {
		alert("Please enter valid odd numbers for width and height.");
		return;
	}

	// Update the rows and columns with the new width and height
	rows = newHeight;
	columns = newWidth;

	// Reset the maze array
	maze = new Array(rows);

	for (let i = 0; i < rows; i++) {
		maze[i] = new Array(columns).fill(false);
		mazecells[i] = maze[i];
	}

	// Reset the grid
	const grid = document.getElementById("grid");
	grid.innerHTML = "";
	rows = newHeight;
	columns = newWidth;
	currentX = 1;
	currentY = 1;
	// Update the grid size
	grid.style.gridTemplateColumns = `repeat(${columns}, 20px)`;
	grid.style.gridTemplateRows = `repeat(${rows}, 20px)`;

	// Call the generateMaze function with a starting point (top-left corner)
	generateMaze(1, 1);

	// Mark the end cell as part of the maze path
	maze[rows - 2][columns - 2] = true;

	var plyrClr = document.getElementById("colourInputStartid");

	var newPlyrClr = plyrClr.value;

	var pthClr = document.getElementById("colourInputPathid");

	var newPthClr = pthClr.value;

	var wallClr = document.getElementById("colourInputWallid");

	var newWllClr = wallClr.value;
	// Display the new maze on the grid
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < columns; j++) {
			const cell = document.createElement("div");
			if (i === 1 && j === 1) {
				cell.className = "grid-item start-cell";
				cell.style.backgroundColor = newPlyrClr;
			} else if (i === rows - 2 && j === columns - 2) {
				cell.className = "grid-item end-cell";
			} else if (maze[i][j]) {
				cell.className = "grid-item maze-path";
				cell.style.backgroundColor = newPthClr;
			} else {
				cell.className = "grid-item wall";
				cell.style.backgroundColor = newWllClr;
			}
			grid.appendChild(cell);
			mazecells[i][j] = cell;
		}
	}
	event.moveCell;
}
// Function to validate if a number is odd
function isValidOdd(num) {
	return num % 2 === 1;
}
let currentX = 1; // Current X position of the green cell

let currentY = 1; // Current Y position of the green cell

// Display the maze on the grid and set up event listener for arrow key presses
window.onload = function () {
	var attninfo = document.getElementById("infoDivButton");
	// TODO animate infodivbutton to draw attention or require interaction of the user before allowing start of maze traversal
	const grid = document.getElementById("grid");
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < columns; j++) {
			const cell = document.createElement("div");
			if (i === 1 && j === 1) {
				cell.className = "grid-item start-cell";
			} else if (i === rows - 2 && j === columns - 2) {
				cell.className = "grid-item end-cell";
			} else if (maze[i][j]) {
				cell.className = "grid-item maze-path";
			} else {
				cell.className = "grid-item wall";
			}
			grid.appendChild(cell);
			mazecells[i][j] = cell;
		}
		currentY = 1;
		currentX = 1;
		event.moveCell;
		regenerateMaze();
	}

	// Function to handle arrow key presses
	function moveCell(event) {
		// Determine the new cell's position based on the arrow key
		let newX = currentX;
		let newY = currentY;

		switch (event.key) {
			case "ArrowUp":
				newX--;
				break;
			case "ArrowDown":
				newX++;
				break;
			case "ArrowLeft":
				newY--;
				break;
			case "ArrowRight":
				newY++;
				break;
			default:
				return;
		}

		// Check if the new cell is a valid path cell (blue) and not a red cell (wall)
		if (isValid(newX, newY) && maze[newX][newY] && !isRedCell(newX, newY)) {
			// Remove the green class from the current cell
			if (mazecells[newX][newY].classList.contains("end-cell")) {
				arrivedAtDestination(newX, newY);
			}
			mazecells[currentX][currentY].classList.remove("start-cell");
			// Change the color of the current cell back to blue
			mazecells[currentX][currentY].classList.add("maze-path");
			var ncell = mazecells[currentX][currentY];
			// Update the current cell position
			currentX = newX;
			currentY = newY;

			// Change the color of the new cell to green (active cell)
			mazecells[newX][newY].classList.remove("maze-path");
			mazecells[newX][newY].classList.add("start-cell");
			var ccell = mazecells[newX][newY];
			var goBack = document.getElementById("goBackInput");
			var canGoBack = goBack.value;
			if (goBack.checked) {
				var pc = getPlayerColour();
				ccell.style.backgroundColor = pc;
			} else {
				var wc = getWallColour();
				var pc = getPlayerColour();
				ccell.style.backgroundColor = pc;
				ncell.style.backgroundColor = wc;
				ncell.classList.remove("start-cell");
				ncell.classList.add("wall");
				ccell.classList.remove("maze-path");
				ccell.classList.add("end-cell");
			}
		}
	}

	var pathComplete = 0;
	var cellCountTotal = 0;
	var wallCount = 0;
	var openCount = 0;
	var passedCount = 0;
	function getCellTotal() {
		cellCountTotal = 0;
		for (let i = 0; i < mazecells.length; i++) {
			for (let j = 0; j < mazecells[i].length; j++) {
				cellCountTotal++;
			}
		}
	}

	function getWallCount() {
		var wallclr = getWallColour();
		for (let i = 0; i < mazecells.length; i++) {
			for (let j = 0; j < mazecells[i].length; j++) {
				var cell = mazecells[i][j];
				if (cell.style.backgroundColor == wallclr && isRedCell(i, j)) {
					wallCount++;
				}
			}
		}
	}

	// Function to check if a cell is a red cell (wall)
	function isRedCell(x, y) {
		return mazecells[x][y].classList.contains("wall");
	}

	window.addEventListener("keydown", moveCell);

	//change start/player colour
	// Get a reference to the color input element for the start cell
	const colorInputStart = document.getElementById("colourInputStartid");

	// Add an event listener to detect changes in the input value
	colorInputStart.addEventListener("input", function () {
		// Get the selected color value
		const selectedColor = colorInputStart.value;

		// Set the color of the start cell
		const startCell = document.querySelector(".start-cell");
		startCell.style.backgroundColor = selectedColor;
	});

	//change end colour
	// Get a reference to the color input element for the start cell
	const colorInputEnd = document.getElementById("colourInputEndid");

	// Add an event listener to detect changes in the input value
	colorInputEnd.addEventListener("input", function () {
		// Get the selected color value
		const selectedEndColor = colorInputEnd.value;

		// Set the color of the start cell
		const endCell = document.querySelector(".end-cell");
		endCell.style.backgroundColor = selectedEndColor;
	});

	//vchange path colour
	// Get a reference to the color input element for the start cell
	const colorInputPath = document.getElementById("colourInputPathid");

	// Add an event listener to detect changes in the input value
	colorInputPath.addEventListener("input", function () {
		// Get the selected color value
		const selectedPathColor = colorInputPath.value;
		for (let i = 0; i < mazecells.length; i++) {
			for (let j = 0; j < mazecells[i].length; j++) {
				const item = mazecells[i][j];
				if (item.classList.contains("maze-path")) {
					item.style.backgroundColor = selectedPathColor;
				}
			}
		}
	});

	//change wall colours
	// Get a reference to the color input element for the start cell
	const colorInputWall = document.getElementById("colourInputWallid");

	// Add an event listener to detect changes in the input value
	colorInputWall.addEventListener("input", function () {
		// Get the selected color value
		const selectedWallColor = colorInputWall.value;
		for (let i = 0; i < mazecells.length; i++) {
			for (let j = 0; j < mazecells[i].length; j++) {
				const item = mazecells[i][j];
				if (item.classList.contains("wall")) {
					item.style.backgroundColor = selectedWallColor;
				}
			}
		}
	});
};
function infoDivClick() {
	const infoDiv = document.getElementById("infoDiv1");
	if (infoDiv.hidden) {
		infoDiv.hidden = false;
	} else if (!infoDiv.hidden) {
		infoDiv.hidden = true;
	}
}
// Get the button and container elements
const infobutton = document.getElementById("infoDivButton");
const container = document.getElementById("infobuttontooltip");
// Create a tooltip element
const tooltip = document.createElement("span");
tooltip.classList.add("tooltip");
tooltip.style.display = "none";
tooltip.innerText = "Click for\nInstructions";
// Append the tooltip to the container
container.appendChild(tooltip);
// Add event listeners to show/hide the tooltip
infobutton.addEventListener("mouseover", () => {
	tooltip.style.display = "block";
	tooltip.style.fontSize = "10";
});
infobutton.addEventListener("mouseout", () => {
	tooltip.style.display = "none";
}); // Get the button and container elements

const regenbutton = document.getElementById("refreshButton");
const container2 = document.getElementById("regenbuttontooltip");
// Create a tooltip element
const tooltip2 = document.createElement("span");
tooltip2.classList.add("tooltip2");
tooltip2.style.display = "none";
tooltip2.innerText = "Click to\nRegenerate";
// Append the tooltip to the container
container.appendChild(tooltip2);
// Add event listeners to show/hide the tooltip
regenbutton.addEventListener("mouseover", () => {
	tooltip2.style.display = "block";
});
regenbutton.addEventListener("mouseout", () => {
	tooltip2.style.display = "none";
});
function arrivedAtDestination(newX, newY) {
	var ccell = mazecells[newX][newY];
	var goBack = document.getElementById("goBackInput");
	var canGoBack = goBack.value;
	if (goBack.checked) {
		ccell.style.color = "green";
	} else {
		var wc = getWallColour();
		ccell.style.backgroundColor = wc;
		var widthInput = document.getElementById("widthIn");
		var heightInput = document.getElementById("heightIn");
		if (isValidOdd(heightInput.value * 1.25 - ((heightInput.value * 1.25) % 2))) {
			heightInput.value =
				heightInput.value * 1.25 - ((heightInput.value * 1.25) % 2);
		} else {
			heightInput.value =
				heightInput.value * 1.25 - ((heightInput.value * 1.25) % 2) + 1;
		}
		if (isValidOdd(widthInput.value * 1.25 - ((widthInput.value * 1.25) % 2))) {
			widthInput.value = widthInput.value * 1.25 - ((widthInput.value * 1.25) % 2);
		} else {
			widthInput.value =
				widthInput.value * 1.25 - ((widthInput.value * 1.25) % 2) + 1;
		}
		regenerateMaze();
		var topright = mazecells[2][2];

		for (i = 0; i < mazecells.length; ++i) {
			for (j = 0; j < mazecells[i].length; ++j) {
				if (mazecells[2][2].classList.contains("start-cell")) {
					mazecells[2][2].classList.remove("start-cell");
					mazecells[2][2].classList.add("end-cell");

					//		topright.classList.remove("wall");
					mazecells[i][j].style.backgroundColor = getPathColour();
					continue;
				}
				if (mazecells[i][j].classList.contains("end-cell")) {
					topright.classList.remove("wall");
					topright.classList.remove("start-cell");
					topright.style.backgroundColor = "orange";
				}
			}
		}
	}
}
