import RouteMap from "./RouteMap";
import { Station, MapContainerRouting } from "@backend/shared";

interface Props {
  children?: React.ReactNode;
  stationList: Station[];
  maps: MapContainerRouting[];
}
export default function MapContainer({ children, stationList, maps }: Props) {
  if (!maps) return null;
  if (maps.length == 0) return null;

  let count = 1;

  return (
    <div className="container">
      {children}
      {maps.map((item, index) => (
        <div key={index}>
          <h3>
            {"Map " +
              count++ +
              ": " +
              item.fromRP +
              " to " +
              item.toRP +
              " with Map " +
              item.title}
          </h3>

          <RouteMap
            stationList={stationList}
            data={item.map}
            from={item.from}
            to={item.to}
          ></RouteMap>
        </div>
      ))}
    </div>
  );
}
