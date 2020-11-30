class Queue {
  constructor() {
    this.q = [];
  }

  isLowerKey(cur, other) {
    if (cur[0] < other[0]) {
      return true;
    } else if (cur[0] == other[0]) {
      return cur[1] <= other[1];
    } else {
      return false;
    }
  }

  //node - the reference to the node object being added
  //key - an array [k1, k2] where list is sorted by k1, tie-breaking k2
  insert(node, key) {
    let elem = {node: node, key: key};

    if (this.q.length == 0) {
      this.q.push(elem);
      return;
    }

    let index = 0;
    let other = this.q[index];
    while (!this.isLowerKey(elem.key, other.key)) {
      index += 1;
      if (index >= this.q.length) {
        this.q.push(elem);
        return;
      }
      other = this.q[index];
    }
    this.q.splice(index, 0, elem);
  }

  pop() {
    return this.q.splice(0, 1)[0].node;
  }

  topKey() {
    if (this.q.length > 0) {
      return this.q[0].key;
    } else {
      return [Number.MAX_VALUE, 0];
    }
  }

  //node - the reference to the node object being removed
  remove(node) {
    for (let i = 0; i < this.q.length; i++) {
      if (node.id == this.q[i].node.id) {
        this.q.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  //node - the reference to the node to check if in queue
  contains(node) {
    for (let i = 0; i < this.q.length; i++) {
      if (node.id == this.q[i].node.id) {
        return true;
      }
    }
    return false;
  }
}

class Node {
  constructor(id, pos) {
    this.pos = pos;
    this.id = id;

    this.successors = [];
    this.predecessors = [];

    this.rhs = Number.MAX_VALUE;
    this.g = Number.MAX_VALUE;
  }

  //endNode - a node reference to the end node of the graph
  heuristic(endNode) {
    return pow(pow(this.pos.x-endNode.pos.x, 2) + pow(this.pos.y-endNode.pos.y, 2), 0.5)/10;
  }

  //n - a node reference
  addSuccesor(n) {
    if (!this.successors.includes(n)) {
      this.successors.push(n);
    }
  }
  getSuccesors() {
    return this.successors;
  }

  //n - a node reference
  addPredecessor(n) {
    if (!this.predecessors.includes(n)) {
      this.predecessors.push(n);
    }
  }
  getPredecessors() {
    return this.predecessors;
  }
}

class Graph {
  constructor(nodeN, start, end, connProb) {
    this.size = nodeN;
    this.start = start;
    this.end = end;
    this.prob = connProb;

    this.cost = this.getFreshCost();

    this.nodes = [];
    for (let i = 0; i < this.size; i++) {
      this.nodes.push(new Node(i, this.getRandomPosition()));
    }
    this.nodes[this.start].rhs = 0;

    for (let i = 0; i < this.size; i++) {
      if (i != this.end) { //end cant have successors
        for (let j = 0; j < this.size; j++) {
          if (i != j && random() < this.prob && !(i == this.start && j == this.end)) { //cant add successors as itself && only happens with probability && start cant add end as successor
            this.nodes[i].addSuccesor(this.nodes[j]);
            if (this.nodes[j].getSuccesors().includes(this.nodes[i])) {
              this.cost[i][j] = this.cost[j][i];
            } else {
              this.cost[i][j] = this.getRandomCost();
            }
          }
        }
      }
    }

    for (let i = 0; i < this.size; i++) {
      if (i != this.start) {
        for (let j = 0; j < this.size; j++) {
          let jSuccessors = this.nodes[j].getSuccesors();
          if (jSuccessors.includes(this.nodes[i])) {
            this.nodes[i].addPredecessor(this.nodes[j]);
          }
        }
      }
    }
  }

  //----------------------- Initializion Functions ----------------------------
  getFreshCost() {
    let out = [];
    for (let i = 0; i < this.size; i++) {
      let tmp = [];
      for (let j = 0; j < this.size; j++) {
        tmp.push(-1);
      }
      out.push(tmp);
    }
    return out;
  }

  getRandomCost() {
    return int(random(MIN_COST, MAX_COST+1));
  }

  getRandomPosition() {
    let x = int(random()*(WIDTH-2*POINT_SIZE)+POINT_SIZE);
    let y = int(random()*(HEIGHT-2*POINT_SIZE)+POINT_SIZE);
    return createVector(x, y);
  }

  //------------------------- LPA* Functions ---------------------------------
  heuristic(node) {
    return node.heuristic(this.getEnd());
  }

  getCost(nodeFrom, nodeTo) {
    return this.cost[nodeFrom.id][nodeTo.id];
  }

  //------------------------- Getters and Setters ----------------------------
  getNode(i) {
    return this.nodes[i];
  }

  getNodes() {
    return this.nodes;
  }

  getPred(i) {
    return this.nodes[i].getPredecessors();
  }

  getSucc(i) {
    return this.nodes[i].getSuccesors();
  }

  getStart() {
    return this.nodes[this.start];
  }

  getEnd() {
    return this.nodes[this.end];
  }
}
