export const fetcher: (any: any) => Promise<any> = (
  url: string | URL | Request,
) => fetch(url).then((r) => r.json());
