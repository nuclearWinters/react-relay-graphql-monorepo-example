export {};

declare global {
  var process: {
    env: {
      AUTH_API?: string;
      FINTECH_API?: string;
    };
  };
}
