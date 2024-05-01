interface MathOperationEvent {
  body: {
    num1: number;
    num2: number;
  };
}

export async function handler(event: MathOperationEvent): Promise<{ result: number }> {
  const { num1, num2 } = event.body;
  const result = num1 * num2;
  return { result };
}
