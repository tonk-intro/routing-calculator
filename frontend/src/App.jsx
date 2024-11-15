import { useState, useEffect } from "react";
import RouteMap from "./components/RouteMap";
import { StationPicker } from "./components/StationPicker";
import "./style.css";
import MapContainer from "./components/MapContainer";

const BACKEND_SERVER = "http://localhost:3000";

function App() {
  const [stationList, setStationList] = useState(null);

  const [route, setRoute] = useState(null);

  const [from, setFrom] = useState("Cambridge");
  const [to, setTo] = useState("Norwich");

  function getRoute(from, to) {
    setRoute(null);
    fetch(BACKEND_SERVER + `/maps/${from}/${to}`)
      .then((response) => response.json())
      .then((res) => {
        if (res.maps != null) {
          setRoute(res);
        }
      });
  }
  function getStations() {
    fetch(BACKEND_SERVER + `/stations`)
      .then((response) => response.json())
      .then((res) => setStationList(res));
  }

  useEffect(() => {
    getStations();
  }, []);

  useEffect(() => {
    if (!stationList) return;
    if (
      stationList.some((st) => st.name == from) &&
      stationList.some((st) => st.name == to)
    ) {
      // console.log(`Let's fetch fetch route from ${from} to ${to}`);
      getRoute(from, to);
    }
  }, [from, to, stationList]);

  return (
    <>
      <div>
        <h1>Permitted Route Calculator</h1>
        <div className="picker-container">
          <StationPicker
            stations={stationList}
            value={from}
            onSelected={(st) => setFrom(st)}
          >
            From:
          </StationPicker>
          <StationPicker
            value={to}
            onSelected={(st) => setTo(st)}
            stations={stationList}
          >
            To:
          </StationPicker>
        </div>
      </div>

      <MapContainer stationList={stationList} maps={route && route.maps}>
        <h2>
          {route && route.fromStation.name} to {route && route.toStation.name}
        </h2>
      </MapContainer>

      <div className="side-by-side">
        <MapContainer
          stationList={stationList}
          maps={route && route.londonMaps.to}
        >
          <h2>{route && route.fromStation.name} to London</h2>
        </MapContainer>

        <MapContainer
          stationList={stationList}
          maps={route && route.londonMaps.from}
        >
          <h2>London to {route && route.toStation.name}</h2>
        </MapContainer>
      </div>
    </>
  );
}

export default App;
