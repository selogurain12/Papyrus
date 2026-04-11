import { initTsrReactQuery } from "@ts-rest/react-query/v5";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { type ApiFetcherArgs, type AppRouter, tsRestFetchApi } from "@ts-rest/core";
import { papyrusContract } from "@papyrus/source";
import { localStorageBasePrefixVariable } from "../local-storage-base-prefix-variable";

const apiUrl = "https://bibliocine.onrender.com";

async function getIdTokenAsync(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(localStorageBasePrefixVariable("idToken"));
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

export const client = createClient(papyrusContract);
