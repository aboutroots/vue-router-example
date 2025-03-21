import { shallowMount } from "@vue/test-utils";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

describe("LoadingSpinner.vue", () => {
  it("renders loading spinner with text", () => {
    const wrapper = shallowMount(LoadingSpinner);

    expect(wrapper.find("svg").exists()).toBe(true);
    expect(wrapper.text()).toContain("Loading...");
    expect(wrapper.find(".animate-spin").exists()).toBe(true);
  });
});
