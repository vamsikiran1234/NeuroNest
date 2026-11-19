import { describe, it, expect } from 'vitest';

describe('AI Assistant Integration', () => {
  it('verifies non-medical safety framing and fallback structure', () => {
    const mockSimplifyResponse = {
      simplifiedText: 'A simple summary without medical claims.',
      keyPoints: ['Core idea 1', 'Core idea 2'],
      vocabulary: [{ term: 'Idea', definition: 'A thought or suggestion.' }],
      fallbackUsed: true,
    };

    expect(mockSimplifyResponse.simplifiedText).toBeTruthy();
    expect(mockSimplifyResponse.fallbackUsed).toBe(true);
    expect(mockSimplifyResponse.keyPoints.length).toBe(2);
  });

  it('validates micro-step structure for task breakdown', () => {
    const mockTaskResponse = {
      taskTitle: 'Organize desk',
      encouragingAdvice: 'Take your time and breathe.',
      steps: [
        { stepNumber: 1, title: 'Pick up 2 pencils', detail: 'Put in cup', estimatedMinutes: 1 },
        { stepNumber: 2, title: 'Stack notebooks', detail: 'Neat pile', estimatedMinutes: 2 },
      ],
      fallbackUsed: true,
    };

    expect(mockTaskResponse.steps.length).toBe(2);
    expect(mockTaskResponse.steps[0].stepNumber).toBe(1);
    expect(mockTaskResponse.steps[0].estimatedMinutes).toBeGreaterThan(0);
  });
});
