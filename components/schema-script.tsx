type SchemaValue = Record<string, unknown> | Array<Record<string, unknown>>;

export function SchemaScript({ id, value }: { id: string; value: SchemaValue }) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(value) }}
    />
  );
}
