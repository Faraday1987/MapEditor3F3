const exportJsonBtn = document.querySelector("#export-json");
const addConectionButton = document.querySelector("#add-connection");
const drag_node = document.querySelector('#drag-node');
const add_path = document.querySelector('#add-path');
const infotxt = document.querySelector("#infotxt");

const INSIDE_LINE_COLOR = '#FF0000';
const BORDER_LINE_COLOR = '#FFFFFF';
const SELECTED_NODE_COLOR = '#FF0000';
const NORMAL_NODE_COLOR = '#e1e1e1';
const BACKGROUND_COLOR = '#F9F9F9';
const NODE_ID_INFO_COLOR = '#1e1e1e';
const NODE_ID_INFO_SHADOW = '#FFFFFF';

const NODE_RADIUS = 6;
const NODE_SIZE = 19;
const NODE_INFO_GAP = 10;
const img = new Image();
let imageNodeReady = false;
img.src = 'assets/ui/Draw_Cursor.png'; // Ruta de la imagen del ícono
img.onload = () => {
  imageNodeReady = true;
  onReady()
};


const ADD_NODE_STATE = 'add-node';
const REMOVE_NODE_STATE = 'remove-node';
const DRAG_NODE_STATE = 'drag-node';
const ADD_LINE_STATE = 'add-line';
const REMOVE_LINE_STATE = 'remove-line';
const CONNECT_NODES_STATE = 'connect-nodes';
const ADD_POINT_TO_LINE_STATE = 'add-point-to-line';
const DRAW_PATH_STATE = 'draw-path';

let currentState = null; // Estado actual de la máquina de estados

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");


canvas.style.backgroundColor = BACKGROUND_COLOR;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let nodes = [];
let lines = []; 
let selectedNode = null;
let isDragging = false;
let mouseOffset = { x: 0, y: 0 };
let isConnectingNodes = false;
let isMovingNode = false;
let nodeToConnect = null;
let textInfo = "Info text..."

// Función para manejar el evento de pulsar una tecla
function handleKeyDown(event) {
  switch (event.keyCode) {
    case 65: // Tecla 'a'
      currentState = ADD_NODE_STATE;
      break;
    case 68: // Tecla 'd'
      currentState = REMOVE_NODE_STATE;
      break;
    case 16: // Tecla 'SHIFT'
      currentState = DRAG_NODE_STATE;
      break;
    case 83: // Tecla 's'
      currentState = ADD_LINE_STATE;
      break;
    case 82: // Tecla 'r'
      currentState = REMOVE_LINE_STATE;
      break;
    case 67: // Tecla 'c'
      currentState = CONNECT_NODES_STATE;
      break;
    case 81: // Tecla 'Q'
      currentState = ADD_POINT_TO_LINE_STATE;
      break;
    case 87: // Tecla 'w'
      currentState = DRAW_PATH_STATE;
      break;
    case 27: // Tecla 'Esc'
      currentState = null;
      break;
    default:
      currentState = null;
      break;
  }
}

// Función para manejar el evento de soltar una tecla
function handleKeyUp(event) {
  currentState = DRAG_NODE_STATE;
}

// Función para dibujar la escena
function draw() {
  // Limpiar canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  //Las dos lineas crean el efecto de una linea con borde
  // Dibujar línea blanca externa
  ctx.strokeStyle = BORDER_LINE_COLOR;
  ctx.lineWidth = 8; // Agregarle la escala del mapa de ser necesario / Floor(parent.parent).scaleX
  for (const line of lines) {
    ctx.beginPath();
    ctx.moveTo(line.start.x, line.start.y);
    ctx.lineTo(line.end.x, line.end.y);
    ctx.stroke();
  }
  // Dibujar línea roja interna
  ctx.strokeStyle = INSIDE_LINE_COLOR;
  ctx.lineWidth = 4; // Agregarle la escala del mapa de ser necesario / Floor(parent.parent).scaleX
  for (const line of lines) {
    ctx.beginPath();
    ctx.moveTo(line.start.x, line.start.y);
    ctx.lineTo(line.end.x, line.end.y);
    ctx.stroke();
  }

  // Dibujar nodos
  for (const node of nodes) {

    ctx.beginPath();
    ctx.arc(node.x, node.y, NODE_RADIUS, 0, 2 * Math.PI);
    if (node === selectedNode) {
      ctx.fillStyle = SELECTED_NODE_COLOR;
      ctx.stroke();
    } else {
      ctx.fillStyle = NORMAL_NODE_COLOR;
      ctx.stroke();
    }
    ctx.fill();
    ctx.save();
    ctx.fillStyle = NODE_ID_INFO_COLOR;
    ctx.shadowOffsetX = -2;
    ctx.shadowOffsetY = 2;
    ctx.shadowColor = NODE_ID_INFO_SHADOW;
    ctx.textAlign = "top";
    ctx.textBaseline = "left";
    ctx.font = "16px Roboto, sans-serif";
    ctx.translate(-NODE_SIZE + NODE_INFO_GAP, -NODE_SIZE+ NODE_INFO_GAP);
    ctx.fillText(node.id, node.x, node.y);
    ctx.restore();
    ctx.drawImage(img, node.x - NODE_SIZE / 2, node.y - NODE_SIZE / 2, NODE_SIZE, NODE_SIZE);
  }
  ctx.restore();
}

// Función para añadir un nodo
function addNode(x, y) {
  const newNode = { id: `n${nodes.length + 1}`, x, y, neighbors: [] };
  nodes.push(newNode);
  selectedNode = newNode;
  draw();
  return newNode;
}

// Función para mover un nodo
function moveNode(node, x, y) {
  node.x = x;
  node.y = y;
  for (const line of lines) {
    if (line.start === node) {
      line.start.x = x;
      line.start.y = y;
    } else if (line.end === node) {
      line.end.x = x;
      line.end.y = y;
    }
  }
  draw();
}

// Función para buscar el nodo que está en una posición
function getNodeAtPosition(x, y) {
  for (const node of nodes) {
    const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
    if (distance <= NODE_RADIUS + NODE_SIZE) {
      return node;
    }
  }
  return null;
}

function getLineAtPosition(x, y) {
  const TOLERANCE = NODE_SIZE;
  for (const line of lines) {
    const start = line.start;
    const end = line.end;
    const distToStart = Math.sqrt((x - start.x) ** 2 + (y - start.y) ** 2);
    const distToEnd = Math.sqrt((x - end.x) ** 2 + (y - end.y) ** 2);
    const distToLine =
      Math.abs((end.y - start.y) * x - (end.x - start.x) * y + end.x * start.y - end.y * start.x) /
      Math.sqrt((end.y - start.y) ** 2 + (end.x - start.x) ** 2);
    if (distToStart <= TOLERANCE || distToEnd <= TOLERANCE || distToLine <= TOLERANCE) {
      return line;
    }
  }
  return null;
}

// Función para manejar el evento de pulsar el ratón
function handleMouseDown(event) {
  const mouseX = event.clientX - canvas.offsetLeft;
  const mouseY = event.clientY - canvas.offsetTop;
  const clickedNode = getNodeAtPosition(mouseX, mouseY);
  const clickedLine = getLineAtPosition(mouseX, mouseY);

  switch (currentState) {
    case ADD_NODE_STATE:
      addNode(mouseX, mouseY);
      break;
    case REMOVE_NODE_STATE:
      if (clickedNode) {
        removeNode(clickedNode);
      }
      break;
    case DRAG_NODE_STATE:
      if (clickedNode) {
        selectedNode = clickedNode;
        mouseOffset.x = mouseX - selectedNode.x;
        mouseOffset.y = mouseY - selectedNode.y;
        isDragging = true;
        isMovingNode = true;
        drag_node.classList.add("active");
      }
      break;
    case ADD_LINE_STATE:
      if (!nodeToConnect) {
        if (clickedNode) {
          nodeToConnect = clickedNode;
        } else if (clickedLine) {
          nodeToConnect = addNode(mouseX, mouseY);
          addConnection(clickedLine.start, nodeToConnect);
          addConnection(nodeToConnect, clickedLine.end);
        }
      } else if (clickedNode && nodeToConnect !== clickedNode) {
        addConnection(nodeToConnect, clickedNode);
        nodeToConnect = null;
      }
      break;
    case ADD_POINT_TO_LINE_STATE:
      if (!nodeToConnect) {
        if (clickedNode) {
          nodeToConnect = clickedNode;
        } else if (clickedLine) {
          // Llamar a la función addPointToLine
          addPointToLine(clickedLine, mouseX, mouseY);
        }
      } else if (clickedNode && nodeToConnect !== clickedNode) {
        addConnection(nodeToConnect, clickedNode);
        nodeToConnect = null;
      }
      break;
    case REMOVE_LINE_STATE:
      if (clickedLine) {
        removeLine(clickedLine);
      }
      break;
    case CONNECT_NODES_STATE:
      if (!isConnectingNodes) {
        isConnectingNodes = true;
        if (clickedNode) {
          nodeToConnect = clickedNode;
        }
      } else if (clickedNode && nodeToConnect !== clickedNode) {
        addConnection(nodeToConnect, clickedNode);
        nodeToConnect = null;
        isConnectingNodes = false;
      } else {
        nodeToConnect = addNode(mouseX, mouseY);
        isConnectingNodes = false;
      }
      break;
      case DRAW_PATH_STATE:
      // Agregar un nuevo nodo a la lista de nodos
      const newNode = addNode(mouseX, mouseY);
      
      // Si hay más de un nodo en la lista, agregar una línea que conecte el último nodo y el nuevo nodo
      if (nodes.length > 1) {
        const lastNode = nodes[nodes.length - 2];
        const newLine = addLine(lastNode.x, lastNode.y, newNode.x, newNode.y);
        addConnection(lastNode, newNode, newLine);
      }
      break;
  }
  updateInfoText();
}

// Función para manejar el evento de mover el ratón
function handleMouseMove(event) {
  if (isDragging && isMovingNode) {
    const mouseX = event.clientX - canvas.offsetLeft;
    const mouseY = event.clientY - canvas.offsetTop;
    const newX = mouseX - mouseOffset.x;
    const newY = mouseY - mouseOffset.y;
    moveNode(selectedNode, newX, newY);
  }
}

// Función para manejar el evento de soltar el ratón
function handleMouseUp(event) {
  isDragging = false;
  isMovingNode = false;
  drag_node.classList.remove("active");

}

// Función para añadir una conexión entre nodos
function addConnection(node1, node2) {

  if (!node1.neighbors.includes(node2)) {
    node1.neighbors.push(node2);
  }
  if (!node2.neighbors.includes(node1)) {
    node2.neighbors.push(node1);
  }
  lines.push({ start: node1, end: node2 }); // Añadir la línea al array de líneas
  draw();
}

// // Función para añadir una conexión entre nodos por id
function addConnectionById(nodeId1, nodeId2) {
  const node1 = nodes.find(node => node.id === nodeId1);
  const node2 = nodes.find(node => node.id === nodeId2);
  
  if (node1 && node2) {
    if (!node1.neighbors.includes(node2)) {
      node1.neighbors.push(node2);
    }
    if (!node2.neighbors.includes(node1)) {
      node2.neighbors.push(node1);
    }
    lines.push({ start: node1, end: node2 });
    draw();
  }
}

// Función para eliminar un nodo
function removeNode(node) {
  // Eliminar el nodo del array de nodos
  nodes = nodes.filter((n) => n !== node);
  // Eliminar las conexiones del nodo
  for (const neighbor of node.neighbors) {
    neighbor.neighbors = neighbor.neighbors.filter((n) => n !== node);
  }
  // Eliminar las líneas que conectan al nodo
  lines = lines.filter((line) => line.start !== node && line.end !== node);
  // Seleccionar otro nodo si el nodo eliminado estaba seleccionado
  if (selectedNode === node) {
    selectedNode = null;
  }

  draw();
}

// Función para eliminar una línea
function removeLine(line) {
  // Eliminar la línea del array de líneas
  lines = lines.filter((l) => l !== line);

  // Eliminar la conexión de los nodos
  const index1 = line.start.neighbors.indexOf(line.end);
  if (index1 !== -1) {
    line.start.neighbors.splice(index1, 1);
  }
  const index2 = line.end.neighbors.indexOf(line.start);
  if (index2 !== -1) {
    line.end.neighbors.splice(index2, 1);
  }
  draw();
}

function addPointToLine(line, x, y) {
  // Crear un nuevo nodo en la posición del punto
  const newNode = addNode(x, y);
  // Reconectar los nodos y líneas asociados a la línea
  const index = lines.indexOf(line);
  const startNode = line.start;
  const endNode = line.end;

  startNode.neighbors = startNode.neighbors.filter(n => n !== endNode);
  endNode.neighbors = endNode.neighbors.filter(n => n !== startNode);

  lines.splice(index, 1);
  addConnection(startNode, newNode);
  addConnection(newNode, endNode);
}

function addLine(startX, startY, endX, endY) {
  const lastNode = nodes[nodes.length - 1];
  const startNode = getNodeAtPosition(startX, startY) || lastNode || addNode(startX, startY);
  const endNode = getNodeAtPosition(endX, endY) || addNode(endX, endY);
  const line = { start: startNode, end: endNode };
  lines.push(line);
  addConnection(startNode, endNode, line);
  return line;
}

// Event listener para el botón de agregar conexión
addConectionButton.addEventListener("click", () => {
  isConnectingNodes = true;
});

// Event listener para el botón de eliminar nodo
document.querySelector("#remove-node").addEventListener("click", () => {
  if (selectedNode) {
    removeNode(selectedNode);
  }
});

// Event listener para el botón de eliminar línea
document.querySelector("#remove-line").addEventListener("click", () => {
  if (selectedNode && selectedNode.neighbors.length > 0) {
    const neighbor = selectedNode.neighbors[0];
    const lineToRemove = lines.find(
      (line) =>
        (line.start === selectedNode && line.end === neighbor) ||
        (line.start === neighbor && line.end === selectedNode)
    );
    if (lineToRemove) {
      removeLine(lineToRemove);
    }
  }
});

// Event listener para el botón de conectar nodos
document.querySelector("#connect-nodes").addEventListener("click", () => {
  isConnectingNodes = !isConnectingNodes;
  if (!isConnectingNodes) {
    nodeToConnect = null;
  }
});

// Event listener para el botón de exportar JSON y descargar el mapa creado
exportJsonBtn.addEventListener("click", () => {
  const data = {
    nodes: nodes.map((node) => ({ ...node, neighbors: node.neighbors.map((neighbor) => neighbor.id) })),
    lines: lines.map((line) => ({ ...line, start: line.start.id, end: line.end.id })),
  };
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "graph.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

// Event listeners para las teclas
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

// Event listeners para el ratón
canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseup', handleMouseUp);

function updateInfoText() {
  switch (currentState) {
    case ADD_NODE_STATE:
      infotxt.innerHTML = "Añadiendo nodo";
      break;
    case REMOVE_NODE_STATE:
      infotxt.innerHTML = "Eliminando nodo";
      break;
    case DRAG_NODE_STATE:
      infotxt.innerHTML = "Presiona SHIFT para mover un nodo";
      break;
    case ADD_LINE_STATE:
      infotxt.innerHTML = "Añadiendo línea";
      break;
    case REMOVE_LINE_STATE:
      infotxt.innerHTML = "Eliminando línea";
      break;
    case CONNECT_NODES_STATE:
      infotxt.innerHTML = "Conectando nodos";
      break;
    case ADD_POINT_TO_LINE_STATE:
      infotxt.innerHTML = "Agregar nodo a una linea";
      break;
    case ADD_POINT_TO_LINE_STATE:
      infotxt.innerHTML = "Agregar nodo a una linea";
      break;
    case DRAW_PATH_STATE:
      infotxt.innerHTML = "Agregar el camino dando click";
      break;
    default:
      infotxt.innerHTML = "";
      break;
  }
}

function onReady() {
// Añadir nodos de ejemplo inicial
addNode(25, 25);
addNode(110, 110);
addNode(50, 180);
addNode(225, 90);
addNode(190, 160);
addNode(230, 170);
addConnectionById("n1", "n3");
addConnectionById("n1", "n2");
addConnectionById("n2", "n3");
addConnectionById("n3", "n5");
addConnectionById("n5", "n4");
addConnectionById("n4", "n2");
addConnectionById("n6", "n4");
addConnectionById("n6", "n3");
draw();

}

