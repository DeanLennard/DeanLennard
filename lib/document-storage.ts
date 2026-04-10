import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

function getPublicDocumentsRoot() {
  return path.join(process.cwd(), "public", "generated-documents");
}

export async function saveGeneratedDocument(input: {
  kind: "quotes" | "invoices";
  fileName: string;
  bytes: Uint8Array;
}) {
  const root = getPublicDocumentsRoot();
  const directory = path.join(root, input.kind);
  await mkdir(directory, { recursive: true });

  const fullPath = path.join(directory, input.fileName);
  await writeFile(fullPath, input.bytes);

  return `/generated-documents/${input.kind}/${input.fileName}`;
}
