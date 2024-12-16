interface Props {
  error: ErrorInfo | null;
}

export interface ErrorInfo {
  errorMsg: string;
}

export default function ErrorView({ error }: Props) {
  if (error) {
    return (
      <div>
        <h2>An Error Occured!</h2>
        <p>{error.errorMsg}</p>
      </div>
    );
  }
  return null;
}
