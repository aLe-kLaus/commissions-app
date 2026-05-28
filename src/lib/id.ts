export function newId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 10);
  const random2 = Math.random().toString(36).slice(2, 10);
  return `${timestamp}-${random}${random2}`;
}
