import { type ApiFetcherArgs, type AppRouter, tsRestFetchApi } from "@ts-rest/core";
import { initTsrReactQuery } from "@ts-rest/react-query/v5";

import { papyrusContract } from "@papyrus/source";

const apiUrl = "http://51.255.162.13:3000";

function getIdTokenAsync(): string | null {
  try {
    return localStorage.getItem("token");
  } catch (error) {
    console.error("Erreur lors de la récupération du token :", error);
    return null;
  }
}

export function createClient<Tcontract extends AppRouter>(contract: Tcontract) {
  const idToken = getIdTokenAsync();

  const tokenAuthorization = idToken === null || idToken === undefined ? "" : `Bearer ${idToken}`;

  return initTsrReactQuery(contract, {
    baseUrl: apiUrl,

    baseHeaders: {
      Authorization: tokenAuthorization,
    },

    api: async (args: ApiFetcherArgs) => {
      const idToken = getIdTokenAsync();
      if (idToken !== null && idToken !== undefined) {
        const header = {
          Authorization: `Bearer ${idToken}`,
        };

        return await tsRestFetchApi({ ...args, headers: header });
      }

      throw new Error("No id token");
    },
  });
}
export type PapyrusClient = ReturnType<typeof createClient<typeof papyrusContract>>;

export const clientFile: PapyrusClient = createClient(papyrusContract);
