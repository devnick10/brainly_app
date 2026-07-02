import { describe, it, expect } from 'vitest';
import { features, steps } from '../constants';

describe('features', () => {
  it('has 6 features', () => {
    expect(features).toHaveLength(6);
  });

  it.each(features)('$title has required fields', (f) => {
    expect(f.icon).toBeDefined();
    expect(f.title).toBeTruthy();
    expect(f.description).toBeTruthy();
  });
});

describe('steps', () => {
  it('has 4 steps', () => {
    expect(steps).toHaveLength(4);
  });

  it.each(steps)('step $step has required fields', (s) => {
    expect(s.step).toBeTruthy();
    expect(s.title).toBeTruthy();
    expect(s.description).toBeTruthy();
  });
});
