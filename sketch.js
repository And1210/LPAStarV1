let graph, lpa;

function setup() {
  createCanvas(WIDTH, HEIGHT);

  graph = new Graph(POINT_NUM, 0, POINT_NUM-1, CONNECTION_PROBABILIY);
  lpa = new LPAStar(graph);
}

function draw() {
  background(0);

  //Drawing the arrows and costs for node connections
  for (let i = 0; i < POINT_NUM; i++) {
    let cur = graph.getNode(i);
    let succ = graph.getSucc(i);
    let pred = graph.getPred(i);
    for (let j = 0; j < succ.length; j++) {
      let arrowColour = color(255, 255, 255);
      arrowColour.setAlpha(127);
      drawArrow(cur.pos, createVector(succ[j].pos.x-cur.pos.x, succ[j].pos.y-cur.pos.y), arrowColour);
      stroke(0, 255, 0);
      fill(0, 255, 0);
      textSize(12);
      text(graph.cost[i][succ[j].id], (cur.pos.x+succ[j].pos.x)/2-5, (cur.pos.y+succ[j].pos.y)/2-5);
      stroke(255, 255, 255);
    }
  }

  //Drawing the nodes and their id's
  for (let i = 0; i < POINT_NUM; i++) {
    let cur = graph.getNode(i);

    stroke(255);
    noFill();
    strokeWeight(2);
    circle(cur.pos.x, cur.pos.y, POINT_SIZE);
    strokeWeight(1);
    stroke(0, 100, 255);
    fill(0, 100, 255);
    textSize(20);
    text(i, cur.pos.x-4, cur.pos.y-2);
    stroke(255, 255, 255);
    noFill();
    textSize(12);
    text(round(graph.heuristic(cur)*10)/10, cur.pos.x-10, cur.pos.y+20);
    stroke(255, 255, 255);
  }

  //Continuously update the lpa star algorithm every draw iteration
  lpa.MainStep();
  showPath();
}

function changeWeights() {
  let from = int(document.getElementById("fromToChange").value);
  let to = int(document.getElementById("toToChange").value);
  let weight = int(document.getElementById("weight").value);

  let nC = getCostCopy();
  nC[from][to] = weight;
  lpa.UpdateCost(nC);
}

function getCostCopy() {
  let out = graph.getFreshCost();
  for (let i = 0; i < graph.cost.length; i++) {
    for (let j = 0; j < graph.cost[i].length; j++) {
      out[i][j] = graph.cost[i][j];
    }
  }
  return out;
}

function showPath() {
  let path = lpa.GetPath();
  let out = "";
  for (let i = 0; i < path.length; i++) {
    out += path[i] + " ";
    if (i < path.length-1) {
      out += "-> ";
    }
  }

  document.getElementById("path").innerHTML = out;
}


// draw an arrow for a vector at a given base position
// Adapted from: https://p5js.org/reference/#/p5.Vector/magSq
function drawArrow(base, vec, myColor) {
  push();
  stroke(myColor);
  strokeWeight(3);
  fill(myColor);
  let ang = vec.heading();
  let r = POINT_SIZE/2;
  translate(base.x + r*cos(ang), base.y + r*sin(ang));
  line(0, 0, vec.x - 2*r*cos(ang), vec.y - 2*r*sin(ang));
  rotate(vec.heading());
  let arrowSize = 7;
  myColor.setAlpha(255);
  stroke(myColor);
  fill(myColor);
  translate(vec.mag() - arrowSize - POINT_SIZE - 3, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}
