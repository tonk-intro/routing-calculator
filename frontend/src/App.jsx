import { useState, useEffect } from "react";
import RouteMap from "./components/RouteMap";
import { StationPicker } from "./components/StationPicker";
import "./style.css";

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

  let count = 1;

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

        {route ? (
          <h2>
            {route.fromStation.name} to {route.toStation.name}
          </h2>
        ) : null}

        {route ? (
          route.maps.map((item, index) => (
            <div key={index}>
              <h3>
                {"Map " +
                  count++ +
                  ": " +
                  item.from +
                  " to " +
                  item.to +
                  " with Map " +
                  item.map.title}
              </h3>
              <RouteMap
                stationList={stationList}
                data={item.map.map}
                from={item.from}
                to={item.to}
              />
            </div>
          ))
        ) : (
          <p> Loading ... </p>
        )}
      </div>
      <div className="side-by-side">
        <div className="container">
          {route && route.londonMaps.to.length > 0
            ? route.londonMaps.to.map((item, index) => (
                <div key={index}>
                  <h3>
                    {"Map " +
                      count++ +
                      ": " +
                      item.from +
                      " to " +
                      item.to +
                      " with Map " +
                      item.map.title}
                  </h3>

                  <RouteMap
                    stationList={stationList}
                    data={item.map.map}
                    from={item.from}
                    to={item.to}
                  ></RouteMap>
                </div>
              ))
            : null}
        </div>

        <div className="container">
          {route && route.londonMaps.from.length > 0
            ? route.londonMaps.from.map((item, index) => (
                <div key={index}>
                  <h3>
                    {"Map " +
                      count++ +
                      ": " +
                      item.from +
                      " to " +
                      item.to +
                      " with Map " +
                      item.map.title}
                  </h3>

                  <RouteMap
                    stationList={stationList}
                    data={item.map.map}
                    from={item.from}
                    to={item.to}
                  ></RouteMap>
                </div>
              ))
            : null}
        </div>
      </div>
    </>
  );
}

export default App;
