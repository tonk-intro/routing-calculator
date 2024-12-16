export interface Station {
  name: string;
  id: string;
  lat?: string;
  long?: string;
}

export interface PermittedRouteMaps<T extends MapContainer> {
  regular: T[];
  london: { from: T[]; to: T[] };
}

export interface PermittedRouteOverview {
  error: boolean;
  fromStation: Station;
  toStation: Station;
  haveSharedRP: boolean;
  sharedRP: Station;
  routingPoints: { from: Station[]; to: Station[] };
  maps: PermittedRouteMaps<MapContainerRouting>;
}

export interface MapContainer {
  map: Map;
  title: string;
  from: string;
  to: string;
}

export interface Map {
  [key: string]: MapEntry;
}

interface MapStationEntry {
  station: string;
  colour: string;
}
interface MapEntry {
  name: string;
  neighbours: MapStationEntry[];
}

export interface MapContainerRouting extends MapContainer {
  toRP: string;
  fromRP: string;
}
