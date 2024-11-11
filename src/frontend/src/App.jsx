import { useState, useEffect } from "react";
import RouteMap from "./components/RouteMap";
import { StationPicker } from "./components/StationPicker";

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
        console.table(res);
        if (res.maps != null) {
          // console.log("Setting the map");
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
      console.log(`Let's fetch fetch route from ${from} to ${to}`);
      getRoute(from, to);
    }
  }, [from, to, stationList]);

  let count = 1;

  return (
    <div>
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

      {route ? (
        <h1>
          {route.fromStation.name} to {route.toStation.name}
        </h1>
      ) : null}

      {route
        ? route.maps.map((item) => (
            <>
              <h2>
                {"Map " +
                  count++ +
                  ": " +
                  item.route +
                  " with Map(s) " +
                  item.map.title}
              </h2>
              <RouteMap
                data={item.map.map}
                from={route.fromStation}
                to={route.toStation}
              />
            </>
          ))
        : "Loading .. "}
      {route && route.londonMaps.to.length > 0
        ? route.londonMaps.to.map((item) => (
            <>
              <h2>
                {"Map " +
                  count++ +
                  ": " +
                  item.route +
                  " with Map(s) " +
                  item.map.title}
              </h2>
              <RouteMap
                data={item.map.map}
                from={route.fromStation}
                to={{ id: "EUS" }}
              />
            </>
          ))
        : null}

      {route && route.londonMaps.from.length > 0
        ? route.londonMaps.from.map((item) => (
            <>
              <h2>
                {"Map " +
                  count++ +
                  ": " +
                  item.route +
                  " with Map(s) " +
                  item.map.title}
              </h2>
              <RouteMap
                data={item.map.map}
                from={{ id: "EUS" }}
                to={route.toStation}
              />
            </>
          ))
        : null}
    </div>
  );
}

export default App;
