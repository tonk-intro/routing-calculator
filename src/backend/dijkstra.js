async function shortestPath(graph, from, to) {
  const visited = [];
  const todo = [];

  const distances = { [from]: { distance: 0 } }; // name: distance, successor

  let prev = graph[from];
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
            console.log(
              `Replacing ${distances[nb.name].predecessor} with ${prev.name} `
            );
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

  let current = distances[to];
  while (current.predecessor != from) {
    console.log(current.predecessor);
    current = distances[current.predecessor];
  }

  console.log(distances[to].distance);
}

module.exports = { shortestPath };
