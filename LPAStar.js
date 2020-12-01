class LPAStar {
  constructor(graph) {
    this.graph = graph;
    this.costChanged = false;
    this.pairs = [];

    this.Initialize();
  }

  Reset(graph) {
    this.graph = graph;
    this.costChanged = false;
    this.pairs = [];

    this.Initialize();
  }

  Initialize() {
    this.U = new Queue();
    for (let i = 0; i < POINT_NUM; i++) {
      this.graph.getNode(i).g = Number.MAX_VALUE;
      this.graph.getNode(i).rhs = Number.MAX_VALUE;
    }
    this.graph.getStart().rhs = 0;
    this.U.insert(this.graph.getStart(), this.CalculateKey(this.graph.getStart()));
  }

  CalculateKey(node) {
    return [min(node.g, node.rhs) + this.graph.heuristic(node), min(node.g, node.rhs)];
  }

  UpdateNode(node) {
    if (node != this.graph.getStart()) {
      node.rhs = Number.MAX_VALUE;
      let pred = node.getPredecessors();
      for (let i = 0; i < pred.length; i++) {
        node.rhs = min(node.rhs, pred[i].g + this.graph.getCost(pred[i], node));
      }
    }
    if (this.U.contains(node)) {
      this.U.remove(node);
    }
    if (node.g != node.rhs) {
      this.U.insert(node, this.CalculateKey(node));
    }
  }

  ComputeShortestPathStep() {
    if (this.U.isLowerKey(this.U.topKey(), this.CalculateKey(this.graph.getEnd())) || this.graph.getEnd().rhs != this.graph.getEnd().g) {
      let node = this.U.pop();
      curNode = node.id;
      if (node.g > node.rhs) {
        node.g = node.rhs;
        let succ = node.getSuccesors();
        for (let i = 0; i < succ.length; i++) {
          this.UpdateNode(succ[i]);
        }
      } else {
        node.g = Number.MAX_VALUE;
        this.UpdateNode(node);
        let succ = node.getSuccesors();
        for (let i = 0; i < succ.length; i++) {
          this.UpdateNode(succ[i]);
        }
      }
    }
  }

  ComputeShortestPath() {
    while (this.U.isLowerKey(this.U.topKey(), this.CalculateKey(this.graph.getEnd())) || this.graph.getEnd().rhs != this.graph.getEnd().g) {
      let node = this.U.pop();
      curNode = node.id;
      if (node.g > node.rhs) {
        node.g = node.rhs;
        let succ = node.getSuccesors();
        for (let i = 0; i < succ.length; i++) {
          this.UpdateNode(succ[i]);
        }
      } else {
        node.g = Number.MAX_VALUE;
        this.UpdateNode(node);
        let succ = node.getSuccesors();
        for (let i = 0; i < succ.length; i++) {
          this.UpdateNode(succ[i]);
        }
      }
    }
    curNode = -1;
  }

  //newCost - a cost matrix of same shape as one in graph with new costs
  UpdateCost(newCost) {
    let pairs = [];
    for (let i = 0; i < this.graph.cost.length; i++) {
      for (let j = 0; j < this.graph.cost[i].length; j++) {
        if (this.graph.cost[i][j] != newCost[i][j]) {
          pairs.push([i, j, newCost[i][j]]);
          if (this.graph.cost[i][j] == -1) {
            this.graph.nodes[i].addSuccesor(this.graph.getNode(j));
            this.graph.nodes[j].addPredecessor(this.graph.getNode(i));
          }
        }
      }
    }
    this.pairs = pairs;
    this.costChanged = true;
  }

  GetPath() {
    if (this.U.isLowerKey(this.U.topKey(), this.CalculateKey(this.graph.getEnd())) || this.graph.getEnd().rhs != this.graph.getEnd().g) {
      return [];
    }

    let path = [this.graph.getEnd()];
    while (path[path.length-1] != this.graph.getStart()) {
      let cur = path[path.length-1];
      let pred = cur.getPredecessors();
      if (pred.length > 0) {
        let best = pred[0];
        let bestScore = best.g + this.graph.getCost(best, cur);
        for (let i = 1; i < pred.length; i++) {
          let score = pred[i].g + this.graph.getCost(pred[i], cur);
          if (score < bestScore) {
            best = pred[i];
            bestScore = score;
          }
        }
        path.push(best);
      }
    }

    let out = [];
    for (let i = path.length-1; i >= 0; i--) {
      out.push(path[i].id);
    }
    return out;
  }

  MainStep(nextStep) {
    if (nextStep) {
      this.ComputeShortestPathStep();
    }
    if (this.costChanged) {
      for (let i = 0; i < this.pairs.length; i++) {
        let cur = this.pairs[i];
        this.graph.cost[cur[0]][cur[1]] = cur[2];
        this.UpdateNode(this.graph.getNode(cur[1]));
      }

      this.costChanged = false;
      this.pairs = [];

      console.log(this.GetPath());
    }
  }
}
