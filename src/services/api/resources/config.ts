import { Config } from "@/types/api";

// Hardcoded for this demo.
export const mockConfig: Config = {
  defaultAccountId: "d1f9f052-62c2-4d72-8c2d-36dc04ad6ba0",
  possibleAccounts: [
    { id: "d1f9f052-62c2-4d72-8c2d-36dc04ad6ba0", name: "Account 1" },
    { id: "c4a6d606-ead3-462c-bc14-ef1fde44228b", name: "Account 2" },
    { id: "d9a95ed9-b62a-4a0c-857d-abadc94bb7b2", name: "Account 3" },
  ],
};

export const configAPI = {
  getConfig: (): Promise<Config> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockConfig);
      }, 3000); // Simulate 1s API delay
    });
  },
};

export default configAPI;
