import { useConfigStore } from "@/stores/config";
import { useAccountStore } from "@/stores/account";

const setDefaultAccount = async () => {
  const accountStore = useAccountStore();
  const configStore = useConfigStore();

  const defaultAccountId = configStore.defaultAccountId;
  const possibleAccounts = configStore.possibleAccounts;

  if (defaultAccountId && possibleAccounts.length > 0) {
    const defaultAccount = possibleAccounts.find(
      (acc) => acc.id === defaultAccountId
    );

    if (defaultAccount) {
      try {
        // Only set default account if there's no account already set (e.g., from URL params)
        if (!accountStore.currentAccount) {
          await accountStore.setAccount(defaultAccount);
        }
      } catch (error) {
        console.error("Failed to set default account:", error);
      }
    }
  }
};

/**
 * Initializes the application with default values.
 *
 * This is a place to add other initialization steps if needed.
 * Note that each step should not override existing values - they might have
 * been set from URL parameters.
 */
const initializeApp = async () => {
  await setDefaultAccount();
};

export default initializeApp;
