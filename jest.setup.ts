class MockResizeObserver {
  private callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe(target: Element): void {
    // 実装...
  }

  unobserve(target: Element): void {
    // 実装...
  }

  disconnect(): void {
    // 実装...
  }
}

// globalオブジェクトにモックを割り当て
global.ResizeObserver = MockResizeObserver as any;
