export default function JsonPreview({ data }) {
  return <pre className="json-preview">{JSON.stringify(data, null, 2)}</pre>;
}