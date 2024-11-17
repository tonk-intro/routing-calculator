import Select from "react-select";

export default function StationSelector({ stationList, name, value }) {
  if (!stationList) return <p>Loading ...</p>;
  return (
    <Select
      className="basic-single"
      classNamePrefix="select"
      defaultValue={"CBG"}
      isClearable={true}
      isSearchable={true}
      name={name}
      options={stationList.map((item) => {
        return { value: item.id, label: item.name };
      })}
    />
  );
}
