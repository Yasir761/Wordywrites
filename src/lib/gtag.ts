export const GA_ID = "G-PL4XKQRECG";

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const pageview = (url: string) => {
  if (!window.gtag) return;

  window.gtag("config", GA_ID, {
    page_path: url,
    debug_mode: true, //  optional but useful in dev
  });
};

export const event = (
  action: string,
  params?: Record<string, any>
) => {
  if (!window.gtag) return;

  window.gtag("event", action, {
    debug_mode: true,  //  optional but useful in dev
    ...params,
  });
};
