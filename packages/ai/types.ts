export interface AIBinding {
  run(
    model: string,
    inputs: {
      text: string[];
    }
  ): Promise<{
    data: number[][];
  }>;
}