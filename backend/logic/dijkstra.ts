import type { Graph, NeighbouringStation } from "./graph";

interface DistanceList {
  [key: string]: Distance;
}

interface Distance {
  distance: number;
  predecessor: string;
}

async function shortestPath(graph: Graph, from: string, to: string) {
  const visited: NeighbouringStation[] = [];
  const todo: NeighbouringStation[] = [];

  const distances: DistanceList = {
    [from]: { distance: 0, predecessor: "" },
  }; // name: distance, successor

  let prev: NeighbouringStation = graph[from] as NeighbouringStation;
  let done = false;

  while (!done) {
    const neighbours = graph[prev.name].neighbours.sort(
      (left, right) => left.distance - right.distance
    );

    for (const nb of neighbours) {
      if (!visited.includes(nb)) {
        todo.push(nb);
      }
      if (!(nb.name in distances)) {
        distances[nb.name] = {
          distance: nb.distance + distances[prev.name].distance,
          predecessor: prev.name,
        };
      } else {
        if (
          nb.distance + distances[prev.name].distance <
          distances[nb.name].distance
        ) {
          if (distances[nb.name].predecessor == prev.name) {
          }
          distances[nb.name].distance =
            nb.distance + distances[prev.name].distance;
          distances[nb.name].predecessor = prev.name;
        }
      }
    }

    if (todo.length == 0) {
      done = true;
    } else {
      prev = todo[0];
      todo.splice(0, 1);
      visited.push(prev);
    }
  }

  const path = [to];

  let current = distances[to];
  while (current.predecessor != from) {
    path.push(current.predecessor);
    current = distances[current.predecessor];
  }

  return { distance: distances[to].distance, path: [...path, from].reverse() };
}

module.exports = { shortestPath };
