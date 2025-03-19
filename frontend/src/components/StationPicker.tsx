import { useRef } from "react";
import { Station } from "@backend/shared";

let counter = 0;

interface Props {
  stations: Station[] | null;
  children?: React.ReactNode;
  value: string;
  onSelected: (selected: string) => void;
}

export function StationPicker({
  stations,
  children,
  onSelected,
  value,
}: Props) {
  const id = useRef(counter++);

  // const lastStation = useRef("");
  // const focused = useRef(false);

  if (!stations) {
    return <p>Loading ...</p>;
  }

  function onChange(e: React.FormEvent<HTMLInputElement>) {
    // if (stations.some((st) => st.name == e.target.value)) {
    onSelected(e.currentTarget.value);
    // }
  }

  function onClick(e: React.FormEvent<HTMLButtonElement>) {
    // if (!focused.current) {
    //   focused.current = true;
    //   if (stations && stations.some((st) => st.name == e.currentTarget.value))
    //     lastStation.current = e.currentTarget.value;
    // e.currentTarget.value = "";
    onSelected("");
  }

  // function onLeaveFocus(e: React.FormEvent<HTMLInputElement>) {
  //   // focused.current = false;
  //   // if (stations && !stations.some((st) => st.name == e.currentTarget.value)) {
  //   //   e.currentTarget.value = lastStation.current;
  //   // }
  // }

  return (
    <div className="station-picker">
      <label htmlFor={id.current + "station"}>{children}</label>
      <input
        list={id.current + "station-list"}
        id={id.current + "station"}
        name={id.current + "station-choice"}
        value={value}
        onChange={(e) => onChange(e)}
        // onBlur={(e) => onLeaveFocus(e)}
      />
      <button onClick={(e) => onClick(e)}>Clear</button>
      <datalist id={id.current + "station-list"}>
        {stations.map((st) => (
          <option key={st.id} value={st.name} />
        ))}
      </datalist>
    </div>
  );
}
