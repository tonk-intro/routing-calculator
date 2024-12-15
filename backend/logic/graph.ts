type NeighbourhoodFunction = (station: string) => Neighbour[];

export interface Station {
  name: string;
  neighbours: NeighbouringStation[];
}

export interface Graph {
  [key: string]: Station;
}

interface Neighbour {
  length: string;
  to_station: string;
}

export interface NeighbouringStation extends Station {
  distance: number;
}

export async function createRailwayGraph(
  stationList: string[],
  neighbourhoodFunction: NeighbourhoodFunction
) {
  const graph: Graph = {};

  for (const station of stationList) {
    const neighbourhood = await neighbourhoodFunction(station);

    graph[station] = { name: station, neighbours: [] };

    for (const neighbour of neighbourhood) {
      graph[station].neighbours.push({
        name: neighbour.to_station,
        distance: +neighbour.length,
        neighbours: [],
      });
    }
  }

  return graph;
}
