async function createRailwayGraph(stationList, neighbourhoodFunction) {
  const graph = {};

  for (const station of stationList) {
    const neighbourhood = await neighbourhoodFunction(station);

    graph[station] = { name: station, neighbours: [] };

    for (const neighbour of neighbourhood) {
      graph[station].neighbours.push({
        name: neighbour.to_station,
        distance: +neighbour.length,
      });
    }
  }

  return graph;
}

module.exports = { createRailwayGraph };
