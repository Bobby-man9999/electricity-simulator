let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let showGrid = true;
let pause = false;
let darkmode = false;
canvas.addEventListener("contextmenu", (e) => e.preventDefault()); // Disable right-click menu

let mousex = 0,
  mousey = 0;
canvas.addEventListener("mousemove", (e) => {
  let rect = canvas.getBoundingClientRect();
  mousex = Math.floor((e.clientX - rect.left) / world.pixelSize);
  mousey = Math.floor((e.clientY - rect.top) / world.pixelSize);
  render();
});

canvas.addEventListener("mousedown", function (e) {
  let rect = canvas.getBoundingClientRect();
  let x = Math.floor((e.clientX - rect.left) / world.pixelSize);
  let y = Math.floor((e.clientY - rect.top) / world.pixelSize);

  if (x >= 0 && x < world.width && y >= 0 && y < world.height) {
    if (e.button === 0) {
      let cell = world.content[y][x];
      if (currentTool === "charge") {
        world.charges[y][x] = 1;
      } else if (cell === 4 && currentTool !== "0") {
        // Switch OFF -> ON
        world.content[y][x] = 5;
      } else if (cell === 5 && currentTool !== "0") {
        // Switch ON -> OFF
        world.content[y][x] = 4;
      } else if (cell === 13 && currentTool !== "0") {
        // Switch OFF -> ON
        world.content[y][x] = 14;
      } else if (cell === 14 && currentTool !== "0") {
        // Switch ON -> OFF
        world.content[y][x] = 13;
      } else {
        // Place current tool
        world.content[y][x] = parseInt(currentTool);
        world.charges[y][x] = 0;
      }
    } else if (e.button === 1) {
      // Middle-click picks
      currentTool = parseInt(world.content[y][x]);
      toolbar
        .querySelectorAll("button")
        .forEach((btn) => btn.classList.remove("active"));
      document
        .querySelector('[data-tool="' + world.content[y][x] + '"]')
        .classList.add("active");
    } else if (e.button === 2) {
      // Right-click clears
      world.content[y][x] = 0;
      world.charges[y][x] = 0;
    }
  }
  render();
});

let world = {
  width: 20,
  height: 20,
  pixelSize: 25,
  content: [],
  charges: [],
};

function init(content) {
  canvas.width = world.width * world.pixelSize;
  canvas.height = world.height * world.pixelSize;
  initContent(content);
  initCharge();
}
function initCharge() {
  world.charges = [];
  for (let y = 0; y < world.height; y++) {
    world.charges[y] = [];
    for (let x = 0; x < world.width; x++) {
      world.charges[y][x] = 0;
    }
  }
}
function initContent(content) {
  world.content = [];
  for (let y = 0; y < world.height; y++) {
    world.content[y] = [];
    for (let x = 0; x < world.width; x++) {
      world.content[y][x] = content;
    }
  }
}

function tick() {
  let newCharge = world.charges.map((row) => [...row]);
  let newWorld = world.content.map((row) => [...row]);

  for (let x = 0; x < world.width; x++) {
    for (let y = 0; y < world.height; y++) {
      let cell = world.content[y][x];

      if (cell === 0 || cell === 4 || cell === 13) {
        newCharge[y][x] = 0;
      } else if (cell === 2) {
        if (world.charges[y][x] === 1) {
          newCharge[y][x] = 0.5;
        } else if (world.charges[y][x] === 0.5) {
          newCharge[y][x] = 0;
        }
      } else if (cell === 1 || cell === 5 || cell === 16) {
        if (world.charges[y][x] === 1) {
          newCharge[y][x] = 0.5;
          if (x + 1 < world.width && world.charges[y][x + 1] === 0)
            newCharge[y][x + 1] = 1;
          if (x - 1 >= 0 && world.charges[y][x - 1] === 0)
            newCharge[y][x - 1] = 1;
          if (y + 1 < world.height && world.charges[y + 1][x] === 0)
            newCharge[y + 1][x] = 1;
          if (y - 1 >= 0 && world.charges[y - 1][x] === 0)
            newCharge[y - 1][x] = 1;
        } else if (world.charges[y][x] === 0.5) {
          newCharge[y][x] = 0;
        }
      } else if (cell === 3 || cell === 14) {
        newCharge[y][x] = 1;
        if (x + 1 < world.width && world.charges[y][x + 1] === 0)
          newCharge[y][x + 1] = 1;
        if (x - 1 >= 0 && world.charges[y][x - 1] === 0)
          newCharge[y][x - 1] = 1;
        if (y + 1 < world.height && world.charges[y + 1][x] === 0)
          newCharge[y + 1][x] = 1;
        if (y - 1 >= 0 && world.charges[y - 1][x] === 0)
          newCharge[y - 1][x] = 1;
      } else if (cell === 6) {
        if (world.charges[y][x] === 1) {
          newCharge[y][x] = 0.5;
          if (x + 1 < world.width && world.charges[y][x + 1] === 0)
            newCharge[y][x + 1] = 1;
          if (x - 1 >= 0 && world.charges[y][x - 1] === 0)
            newCharge[y][x - 1] = 1;
        } else if (world.charges[y][x] === 0.5) {
          newCharge[y][x] = 0;
        }
      } else if (cell === 7) {
        if (world.charges[y][x] === 1) {
          newCharge[y][x] = 0.5;
          if (y + 1 < world.height && world.charges[y + 1][x] === 0)
            newCharge[y + 1][x] = 1;
          if (y - 1 >= 0 && world.charges[y - 1][x] === 0)
            newCharge[y - 1][x] = 1;
        } else if (world.charges[y][x] === 0.5) {
          newCharge[y][x] = 0;
        }
      } else if (cell === 8) {
        if (world.charges[y][x] === 1) {
          newCharge[y][x] = 0.75;
        } else if (world.charges[y][x] === 0.75) {
          newCharge[y][x] = 0.5;
          if (x + 1 < world.width && world.charges[y][x + 1] === 0)
            newCharge[y][x + 1] = 1;
          if (x - 1 >= 0 && world.charges[y][x - 1] === 0)
            newCharge[y][x - 1] = 1;
          if (y + 1 < world.height && world.charges[y + 1][x] === 0)
            newCharge[y + 1][x] = 1;
          if (y - 1 >= 0 && world.charges[y - 1][x] === 0)
            newCharge[y - 1][x] = 1;
        } else if (world.charges[y][x] === 0.5) {
          newCharge[y][x] = 0.25;
        } else if (world.charges[y][x] === 0.25) {
          newCharge[y][x] = 0.0;
        }
      } else if (cell === 9) {
        if (world.charges[y][x] === 1) {
          newCharge[y][x] = 0.5;
          if (y + 1 < world.height && world.charges[y + 1][x] === 0)
            newCharge[y + 1][x] = 1;
        } else if (world.charges[y][x] === 0.5) {
          newCharge[y][x] = 0;
        }
      } else if (cell === 10) {
        if (world.charges[y][x] === 1) {
          newCharge[y][x] = 0.5;
          if (y - 1 >= 0 && world.charges[y - 1][x] === 0)
            newCharge[y - 1][x] = 1;
        } else if (world.charges[y][x] === 0.5) {
          newCharge[y][x] = 0;
        }
      } else if (cell === 11) {
        if (world.charges[y][x] === 1) {
          newCharge[y][x] = 0.5;
          if (x + 1 >= 0 && world.charges[y][x + 1] === 0)
            newCharge[y][x + 1] = 1;
        } else if (world.charges[y][x] === 0.5) {
          newCharge[y][x] = 0;
        }
      } else if (cell === 12) {
        if (world.charges[y][x] === 1) {
          newCharge[y][x] = 0.5;
          if (x - 1 >= 0 && world.charges[y][x - 1] === 0)
            newCharge[y][x - 1] = 1;
        } else if (world.charges[y][x] === 0.5) {
          newCharge[y][x] = 0;
        }
      } else if (cell === 17) {
        if (world.charges[y][x] === 1) {
          newCharge[y][x] = 0.5;
          if (x + 1 < world.width && world.charges[y][x + 1] === 0)
            newCharge[y][x + 1] = 1;
          if (x - 1 >= 0 && world.charges[y][x - 1] === 0)
            newCharge[y][x - 1] = 1;
          if (y + 1 < world.height && world.charges[y + 1][x] === 0)
            newCharge[y + 1][x] = 1;
          if (y - 1 >= 0 && world.charges[y - 1][x] === 0)
            newCharge[y - 1][x] = 1;
        } else if (world.charges[y][x] === 0.5) {
          newCharge[y][x] = 0;
          newWorld[y][x] = 0;
        }
      } else if (cell === 18) {
        if (world.charges[y][x] === 1) {
          newWorld[y][x] = 0;
          const d = [
            [0, 0],
            [1, 0],
            [0, 1],
            [-1, 0],
            [0, -1],
            [1, 1],
            [-1, 1],
            [1, -1],
            [-1, -1],
          ];
          for (let i of d) {
            newWorld[y + i[0]][x + i[1]] = 0;
          }
        }
      }
    }
  }
  world.charges = newCharge;
  world.content = newWorld;
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let x = 0; x < world.width; x++) {
    for (let y = 0; y < world.height; y++) {
      let cell = world.content[y][x];
      ctx.fillStyle = "white";
      ctx.fillRect(
        x * world.pixelSize,
        y * world.pixelSize,
        world.pixelSize,
        world.pixelSize
      );
      if (cell === 0) {
      } else if (cell === 1) {
        ctx.fillStyle = world.charges[y][x] !== 0 ? "yellow" : "darkred";
        ctx.fillRect(
          x * world.pixelSize,
          y * world.pixelSize,
          world.pixelSize,
          world.pixelSize
        );
      } else if (cell === 2 || cell === 16) {
        ctx.fillStyle = world.charges[y][x] !== 0 ? "red" : "darkgray";
        ctx.fillRect(
          x * world.pixelSize,
          y * world.pixelSize,
          world.pixelSize,
          world.pixelSize
        );
      } else if (cell === 3) {
        ctx.fillStyle = "green";
        ctx.fillRect(
          x * world.pixelSize,
          y * world.pixelSize,
          world.pixelSize,
          world.pixelSize
        );
      } else if (cell === 4) {
        // Switch OFF
        ctx.fillStyle = "gray";
        ctx.fillRect(
          x * world.pixelSize,
          y * world.pixelSize,
          world.pixelSize,
          world.pixelSize
        );
      } else if (cell === 5) {
        // Switch ON
        ctx.fillStyle = world.charges[y][x] !== 0 ? "gold" : "limegreen";
        ctx.fillRect(
          x * world.pixelSize,
          y * world.pixelSize,
          world.pixelSize,
          world.pixelSize
        );
      } else if (cell === 6) {
        ctx.fillStyle = world.charges[y][x] !== 0 ? "yellow" : "darkred";
        ctx.fillRect(
          x * world.pixelSize,
          y * world.pixelSize + (world.pixelSize - 4) / 2,
          world.pixelSize,
          4
        );
      } else if (cell === 7) {
        ctx.fillStyle = world.charges[y][x] !== 0 ? "yellow" : "darkred";
        ctx.fillRect(
          x * world.pixelSize + (world.pixelSize - 4) / 2,
          y * world.pixelSize,
          4,
          world.pixelSize
        );
      } else if (cell === 8) {
        ctx.fillStyle = world.charges[y][x] !== 0 ? "olive" : "purple";
        ctx.fillRect(
          x * world.pixelSize,
          y * world.pixelSize,
          world.pixelSize,
          world.pixelSize
        );
      } else if (cell === 9) {
        ctx.fillStyle = world.charges[y][x] !== 0 ? "yellow" : "darkred";
        ctx.fillRect(
          x * world.pixelSize,
          y * world.pixelSize,
          world.pixelSize,
          world.pixelSize
        );
        ctx.fillStyle = "darkgray";
        ctx.font = "20px Arial";
        ctx.fillText("V", x * world.pixelSize, (y + 1) * world.pixelSize);
      } else if (cell === 10) {
        ctx.fillStyle = world.charges[y][x] !== 0 ? "yellow" : "darkred";
        ctx.fillRect(
          x * world.pixelSize,
          y * world.pixelSize,
          world.pixelSize,
          world.pixelSize
        );
        ctx.fillStyle = "darkgray";
        ctx.font = "20px Arial";
        ctx.fillText("^", x * world.pixelSize, (y + 1) * world.pixelSize);
      } else if (cell === 11) {
        ctx.fillStyle = world.charges[y][x] !== 0 ? "yellow" : "darkred";
        ctx.fillRect(
          x * world.pixelSize,
          y * world.pixelSize,
          world.pixelSize,
          world.pixelSize
        );
        ctx.fillStyle = "darkgray";
        ctx.font = "20px Arial";
        ctx.fillText(">", x * world.pixelSize, (y + 1) * world.pixelSize);
      } else if (cell === 12) {
        ctx.fillStyle = world.charges[y][x] !== 0 ? "yellow" : "darkred";
        ctx.fillRect(
          x * world.pixelSize,
          y * world.pixelSize,
          world.pixelSize,
          world.pixelSize
        );
        ctx.fillStyle = "darkgray";
        ctx.font = "20px Arial";
        ctx.fillText("<", x * world.pixelSize, (y + 1) * world.pixelSize);
      } else if (cell === 13) {
        ctx.fillStyle = "gray";
        ctx.fillRect(
          x * world.pixelSize,
          y * world.pixelSize,
          world.pixelSize,
          world.pixelSize
        );
      } else if (cell === 14) {
        ctx.fillStyle = "khaki";
        ctx.fillRect(
          x * world.pixelSize,
          y * world.pixelSize,
          world.pixelSize,
          world.pixelSize
        );
      } else if (cell === 15) {
        ctx.fillStyle = "lightgray";
        ctx.fillRect(
          x * world.pixelSize,
          y * world.pixelSize,
          world.pixelSize,
          world.pixelSize
        );
      } else if (cell === 17) {
        ctx.fillStyle = "aqua";
        ctx.fillRect(
          x * world.pixelSize,
          y * world.pixelSize,
          world.pixelSize,
          world.pixelSize
        );
      } else if (cell === 18) {
        ctx.fillStyle = "black";
        ctx.fillRect(
          x * world.pixelSize,
          y * world.pixelSize,
          world.pixelSize,
          world.pixelSize
        );
      }
      if (showGrid) {
        ctx.strokeStyle = "gray";
        ctx.lineWidth = 2;
        ctx.strokeRect(
          x * world.pixelSize,
          y * world.pixelSize,
          world.pixelSize,
          world.pixelSize
        );
      }
    }
  }
  ctx.strokeStyle = "rgb(0, 0, 0)";
  ctx.strokeRect(
    mousex * world.pixelSize,
    mousey * world.pixelSize,
    world.pixelSize,
    world.pixelSize
  );
}

let currentTool = 1; // Default to Wire

const toolbar = document.getElementById("toolbar");
toolbar.addEventListener("click", (e) => {
  if (e.target.id == "optionsOpen") {
  } else if (e.target.id == "pause") {
    pause = !pause;
  } else if (e.target.id == "step") {
    tick();
  } else if (e.target.tagName === "BUTTON") {
    currentTool = e.target.getAttribute("data-tool");

    // Remove 'active' class from all buttons
    toolbar
      .querySelectorAll("button")
      .forEach((btn) => btn.classList.remove("active"));

    // Add 'active' class to clicked button
    e.target.classList.add("active");
  }
});

init(0);
let tps = 10;
let gameloop = setInterval(() => {
  if (!pause) {
    tick();
  }
  render();
}, 1000 / tps);

// options
document.getElementById("fillGrid").addEventListener("click", (e) => {
  init(parseInt(currentTool));
});
document.getElementById("tps").addEventListener("input", (e) => {
  tps = document.getElementById("tps").value;
  clearInterval(gameloop);
  gameloop = setInterval(() => {
    if (!pause) {
      tick();
    }
    render();
  }, 1000 / tps);
});
document.getElementById("psize").addEventListener("input", (e) => {
  world.pixelSize = parseInt(e.target.value) || 25;
  canvas.width = world.width * world.pixelSize;
  canvas.height = world.height * world.pixelSize;
  render();
});
document.getElementById("wsize").addEventListener("input", (e) => {
  world.width = document.getElementById("wsize").value;
  world.height = document.getElementById("wsize").value;
  init(0);
});
document.getElementById("reset").addEventListener("click", (e) => {
  init(0);
});
document.getElementById("optionsOpen").addEventListener("click", (e) => {
  showOptions();
});
document.getElementById("optionsClose").addEventListener("click", (e) => {
  hideOptions();
});
document.getElementById("toggleGrid").addEventListener("change", (e) => {
  showGrid = e.target.checked;
  render();
});

const optionsDiv = document.getElementById("options");

function showOptions() {
  optionsDiv.style.display = "block";
}

function hideOptions() {
  optionsDiv.style.display = "none";
}
/*
document.getElementById('loadBtn').addEventListener('click', () => {
    const data = localStorage.getItem('savedWorld-' + prompt('Load World Named:'))
    if (data) {
        const parsed = JSON.parse(data)
        world.content = parsed.content
        world.charges = parsed.charges
        world.width = parsed.width
        world.height = parsed.height
        world.pixelSize = parsed.pixelSize

        canvas.width = world.width * world.pixelSize
        canvas.height = world.height * world.pixelSize

        render()
        alert('World loaded!')
    } else {
        alert('No world found.')
    }
})
*/
function openWorldList() {
  const container = document.getElementById("worldItems");
  container.innerHTML = "";
  const saved = JSON.parse(localStorage.getItem("savedWorlds")) || {};

  Object.entries(saved).forEach(([name, data]) => {
    const row = document.createElement("div");
    row.style.marginBottom = "10px";
    row.innerHTML = `
            <strong>${name}</strong>
            <button onclick="loadWorld('${name}')">Load</button>
            <button onclick="overwriteWorld('${name}')">Overwrite</button>
            <button onclick="deleteWorld('${name}')">Delete</button>
        `; //             <button onclick="exportToFile('${name}')">Export</button>
    container.appendChild(row);
  });

  document.getElementById("worldList").style.display = "block";
  document.getElementById("options").style.display = "none";
}

function closeWorldList() {
  document.getElementById("worldList").style.display = "none";
  document.getElementById("options").style.display = "block";
}

function getSavedWorlds() {
  return JSON.parse(localStorage.getItem("savedWorlds")) || {};
}

function saveCurrentWorld() {
  const name = document.getElementById("worldNameInput").value.trim();
  if (!name) return alert("Enter a name to save the world.");
  const saved = getSavedWorlds();
  if (!saved.hasOwnProperty(name)) {
    const saved = getSavedWorlds();
    saved[name] = exportWorld(); // <- export your current world state
    localStorage.setItem("savedWorlds", JSON.stringify(saved));
    openWorldList(); // refresh list
  } else {
    alert(
      "This world already exists. If you were trying to overwrite this world, please go to the world and press 'Overwite'"
    );
  }
}

function overwriteWorld(name) {
  if (confirm("Are you sure? This will erase the previous world data!")) {
    const saved = getSavedWorlds();
    saved[name] = exportWorld();
    localStorage.setItem("savedWorlds", JSON.stringify(saved));
    openWorldList();
  }
}

function loadWorld(name) {
  const saved = getSavedWorlds();
  if (!saved[name]) return alert("World not found.");
  importWorld(saved[name]); // <- load into your simulation
  closeWorldList();
}

function deleteWorld(name) {
  if (confirm("Are you sure? This will erase the previous world data!")) {
    const saved = getSavedWorlds();
    delete saved[name];
    localStorage.setItem("savedWorlds", JSON.stringify(saved));
    openWorldList();
  }
}

function exportWorld() {
  const data = {
    width: world.width,
    height: world.height,
    pixelSize: world.pixelSize,
    content: JSON.parse(JSON.stringify(world.content)),
    charges: JSON.parse(JSON.stringify(world.charges)),
  };
  return data;
}

function importWorld(data) {
  world = {
    width: data.width,
    height: data.height,
    pixelSize: data.pixelSize,
    content: JSON.parse(JSON.stringify(data.content)),
    charges: JSON.parse(JSON.stringify(data.charges)),
  };
  init(0);
  world = {
    width: data.width,
    height: data.height,
    pixelSize: data.pixelSize,
    content: JSON.parse(JSON.stringify(data.content)),
    charges: JSON.parse(JSON.stringify(data.charges)),
  };
}

/*
function exportToFile(name) {
  const saved = getSavedWorlds();
  const cleanWorld = saved[name];
  const jsonStr = JSON.stringify(cleanWorld, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "world.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

const fileInput = document.getElementById('fileInput');
const openFileBtn = document.getElementById('openFileBtn');

// Open file selector when button is clicked
openFileBtn.addEventListener('click', () => {
    fileInput.click();
});

// Handle file selection
fileInput.addEventListener('change', e => {
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(e) {
            world = JSON.parse(JSON.stringify(e.target.result)).content.map(row => row.map(cell => cell === null ? 0 : cell))
        };
    }
});
*/
