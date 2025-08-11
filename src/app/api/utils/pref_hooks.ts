export async function profileAgent<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = performance.now();
  try {
    const result = await fn();
    const end = performance.now();
    console.log(`[Agent: ${name}] Execution time: ${(end - start).toFixed(2)}ms`);
    return result;
  } catch (err) {
    console.error(`[Agent: ${name}] Failed with error:`, err);
    throw err;
  }
}
