const INGEST_HEADER = "x-ingest-secret";

export function verifyIngestSecret(request: Request): boolean {
  const expected = process.env.WORKER_INGEST_SECRET;
  if (!expected) {
    return false;
  }
  return request.headers.get(INGEST_HEADER) === expected;
}

export function unauthorizedResponse(): Response {
  return new Response("Unauthorized", { status: 401 });
}
