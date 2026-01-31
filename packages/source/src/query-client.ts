import type { AppRoute, AppRouter } from "@ts-rest/core";
import type { z } from "zod";

import { papyrusContract } from "./contracts/index.contract";

interface RouteParameters<Tdata extends AppRoute> {
  pathParams?: Tdata extends { pathParams: z.ZodType<infer Pdata> } ? Pdata : undefined;
  query?: Tdata extends { query: z.ZodType<infer Qdata> } ? Qdata : undefined;
}

type QueryKey<
  Trouter extends AppRouter,
  Tpath extends keyof Trouter,
> = Trouter[Tpath] extends AppRoute
  ? Trouter[Tpath] extends { pathParams: z.ZodType; query: z.ZodType }
    ? readonly [Tpath, ...(number | string)[], { [key: string]: unknown }]
    : Trouter[Tpath] extends { pathParams: z.ZodType }
      ? readonly [Tpath, ...(number | string)[]]
      : Trouter[Tpath] extends { query: z.ZodType }
        ? readonly [Tpath, { [key: string]: unknown }]
        : readonly [Tpath]
  : never;

type QueryKeyFactory<Tdata extends AppRouter> = {
  [Kdata in keyof Tdata]: Tdata[Kdata] extends AppRoute
    ? (
        // eslint-disable-next-line no-unused-vars
        parameters?: RouteParameters<Tdata[Kdata]> extends never
          ? undefined
          : Partial<RouteParameters<Tdata[Kdata]>>
      ) => QueryKey<Tdata, Kdata>
    : Tdata[Kdata] extends AppRouter
      ? QueryKeyFactory<Tdata[Kdata]>
      : never;
};

function createQueryKey<Trouter extends AppRouter, Tpath extends keyof Trouter>(
  path: Tpath,
  parameters?: RouteParameters<AppRoute & Trouter[Tpath]>,
  debug = false
): QueryKey<Trouter, Tpath> {
  const pathParameters =
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    parameters?.pathParams === undefined ? [] : Object.values(parameters.pathParams);

  const queryParameters =
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    parameters?.query === undefined ? undefined : JSON.stringify(parameters.query);

  if (debug) {
    // eslint-disable-next-line no-console
    console.debug("[DEBUG] QueryKey Generated:", {
      path,
      pathParameters,
      queryParameters,
    });
  }

  return queryParameters === undefined
    ? ([path, ...pathParameters] as unknown as QueryKey<Trouter, Tpath>)
    : ([path, ...pathParameters, JSON.parse(queryParameters)] as unknown as QueryKey<
        Trouter,
        Tpath
      >);
}

function generateQueryKeys<Tdata extends AppRouter>(
  router: Tdata,
  prefix = ""
): QueryKeyFactory<Tdata> {
  return Object.entries(router).reduce<Partial<QueryKeyFactory<Tdata>>>(
    (accumulator, [key, value]) => {
      const fullPath = prefix ? `${prefix}.${key}` : key;

      if ("path" in value) {
        accumulator[key as keyof Tdata] = ((
          parameters?: RouteParameters<Extract<typeof value, AppRoute>>
        ) => createQueryKey(fullPath, parameters)) as QueryKeyFactory<Tdata>[keyof Tdata];
      } else if (typeof value === "object") {
        accumulator[key as keyof Tdata] = generateQueryKeys(
          value,
          fullPath
        ) as QueryKeyFactory<Tdata>[keyof Tdata];
      } else {
        throw new TypeError(`Invalid router structure at ${fullPath}`);
      }

      return accumulator;
    },
    {}
  ) as QueryKeyFactory<Tdata>;
}

const queryKeys = generateQueryKeys(papyrusContract);

export { queryKeys };
