import { SWRConfiguration } from "swr";

export const swrConfig: SWRConfiguration = {
  fetcher: (url) => fetch(url).then((res) => res.json()),
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  dedupingInterval: 3000,
  shouldRetryOnError: false,
};
