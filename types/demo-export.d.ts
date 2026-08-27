export {};

declare global {
  interface Window {
    __BRIKLI_DEMO_EXPORT__?: {
      ready: boolean;
      complete: boolean;
    };
  }
}
