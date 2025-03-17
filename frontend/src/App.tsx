import { useState, useEffect } from "react";
import { StationPicker } from "./components/StationPicker";
import "./style.css";
import RouteOverview from "./components/RouteOverview";
import type { ErrorInfo } from "./components/ErrorView";

import { Station, PermittedRouteOverview } from "@backend/shared";

const BACKEND_SERVER = import.meta.env.VITE_BACKEND;

function App() {
  const [stationList, setStationList] = useState<Station[] | null>(null);

  const [error, setError] = useState<ErrorInfo | undefined>(undefined);

  const [route, setRoute] = useState<PermittedRouteOverview | null>(null);

  const [from, setFrom] = useState("Cambridge");
  const [to, setTo] = useState("Norwich");

  function getRoute(from: string, to: string) {
    setRoute(null);
    setError(undefined);
    fetch(BACKEND_SERVER + `/maps/${from}/${to}`)
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        console.log("SETTING ROUTE");
        console.log(res);
        if (res.error) {
          throw new Error(res.errorMsg);
        }

        setRoute(res);
      })
      .catch((err) => {
        setError({
          errorMsg: `Failed to fetch route: ${err.message}.`,
        });
      });
  }
  function getStations() {
    fetch(BACKEND_SERVER + `/stations`)
      .then((response) => response.json())
      .then((res) => {
        if (res.error) {
          throw new Error(res.errorMsg);
        }

        setStationList(res);
      })
      .catch((err) => {
        setRoute(null);
        setError({
          errorMsg: `Failed to fetch stations: ${err.message}.`,
        });
      });
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
            onSelected={(st: string) => setFrom(st)}
          >
            From:
          </StationPicker>
          <StationPicker
            value={to}
            onSelected={(st: string) => setTo(st)}
            stations={stationList}
          >
            To:
          </StationPicker>
        </div>
      </div>

      <RouteOverview stationList={stationList} error={error} route={route} />
    </>
  );
}

export default App;
