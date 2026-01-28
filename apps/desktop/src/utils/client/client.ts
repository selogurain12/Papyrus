import { initTsrReactQuery } from "@ts-rest/react-query/v5";
import { type ApiFetcherArgs, type AppRouter, tsRestFetchApi } from "@ts-rest/core";
import { papyrusContract } from "@papyrus/source";

const apiUrl = "http://localhost:3000";

function getIdTokenAsync(): string | null {
  try {
    return localStorage.getItem("token");
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
      const idToken = getIdTokenAsync();
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

export type PapyrusClient = ReturnType<typeof createClient<typeof papyrusContract>>;

export const client: PapyrusClient = createClient(papyrusContract);
