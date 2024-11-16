export default function ErrorView({ data }) {
  if (!data) return <p>Loading ...</p>;
  if (!data.error) return null;

  return (
    <div>
      <h2>An Error Occured!</h2>
      <p>{data.errorMsg}</p>
    </div>
  );
}
