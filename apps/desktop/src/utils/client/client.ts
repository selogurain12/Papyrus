import { initTsrReactQuery } from "@ts-rest/react-query/v5";
import {
  type ApiFetcherArgs,
  type AppRouter,
  tsRestFetchApi,
} from "@ts-rest/core";
import { localStorageBasePrefixVariable } from "../local-storage-base-prefix-variable";
import { papyrusContract } from "@papyrus/source";

const apiUrl = "https://bibliocine.onrender.com";

async function getIdTokenAsync(): Promise<string | null> {
  try {
    return await localStorage.getItem(localStorageBasePrefixVariable("idToken"));
  } catch (error) {
    console.error("Erreur lors de la récupération du token :", error);
    return null;
  }
}

export function createClient<Tcontract extends AppRouter>(contract: Tcontract) {
  return initTsrReactQuery(contract, {
    baseUrl: apiUrl,

    baseHeaders: {
      "Content-Type": "application/json",
    },

    jsonQuery: false,

    api: async (args: ApiFetcherArgs) => {
      const idToken = await getIdTokenAsync();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (idToken) {
        headers.Authorization = `Bearer ${idToken}`;
      }
      return await tsRestFetchApi({ ...args, headers });
    },
  });
}

export type PapyrusClient = ReturnType<
  typeof createClient<typeof papyrusContract>
>;

export const client: PapyrusClient = createClient(papyrusContract);
