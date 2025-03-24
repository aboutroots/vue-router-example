import { createPinia, setActivePinia } from "pinia";
import { useSpecialModeStore, SpecialModeType } from "@/stores/specialMode";
import { queryUpdater } from "@/services/QueryUpdater";

// Mock QueryUpdater
jest.mock("@/services/QueryUpdater", () => ({
  queryUpdater: {
    updateQueryParams: jest.fn(),
  },
}));

describe("specialMode store", () => {
  let store: ReturnType<typeof useSpecialModeStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useSpecialModeStore();
    jest.clearAllMocks();
  });

  test("initial state", () => {
    expect(store.mode).toBeNull();
  });

  test("setMode updates mode and calls queryUpdater by default", () => {
    // Arrange
    const mode: SpecialModeType = "PRIMARY";

    // Act
    store.setMode(mode);

    // Assert
    expect(store.mode).toBe("PRIMARY");
    expect(queryUpdater.updateQueryParams).toHaveBeenCalledWith({
      specialMode: "PRIMARY",
    });
  });

  test("setMode with updateUrl=false does not update URL", () => {
    // Arrange
    const mode: SpecialModeType = "PRIMARY";

    // Act
    store.setMode(mode, { updateUrl: false });

    // Assert
    expect(store.mode).toBe("PRIMARY");
    expect(queryUpdater.updateQueryParams).not.toHaveBeenCalled();
  });

  test("clearMode sets mode to null and calls queryUpdater by default", () => {
    // Arrange
    store.mode = "SECONDARY";

    // Act
    store.clearMode();

    // Assert
    expect(store.mode).toBeNull();
    expect(queryUpdater.updateQueryParams).toHaveBeenCalledWith({
      specialMode: null,
    });
  });

  test("clearMode with updateUrl=false does not update URL", () => {
    // Arrange
    store.mode = "SECONDARY";

    // Act
    store.clearMode({ updateUrl: false });

    // Assert
    expect(store.mode).toBeNull();
    expect(queryUpdater.updateQueryParams).not.toHaveBeenCalled();
  });

  test("setMode with different values updates correctly", () => {
    // Act - Set PRIMARY
    store.setMode("PRIMARY");

    // Assert
    expect(store.mode).toBe("PRIMARY");
    expect(queryUpdater.updateQueryParams).toHaveBeenCalledWith({
      specialMode: "PRIMARY",
    });

    // Reset mock
    jest.clearAllMocks();

    // Act - Set SECONDARY
    store.setMode("SECONDARY");

    // Assert
    expect(store.mode).toBe("SECONDARY");
    expect(queryUpdater.updateQueryParams).toHaveBeenCalledWith({
      specialMode: "SECONDARY",
    });
  });
});
