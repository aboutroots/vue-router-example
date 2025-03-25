<template>
  <transition name="fade">
    <div
      v-if="hasActiveModals"
      class="fixed inset-0 w-full h-full bg-black bg-opacity-25 flex justify-center items-center z-[1000]"
    >
      <transition-group name="fade" tag="div" class="absolute inset-0">
        <div
          v-for="(modal, index) in sortedModals"
          :key="modal.id"
          class="absolute inset-0 flex justify-center items-center"
          :style="{ zIndex: String(1000 + index) }"
        >
          <component
            :is="modal.component"
            v-bind="modal.props"
            @close="() => closeModal(modal.id)"
          />
        </div>
      </transition-group>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from "vue";
import { useModalStore } from "@/stores/modals";
import { mapState } from "pinia";
import { ModalState } from "@/types/modals";

export default Vue.extend({
  name: "ModalContainer",
  computed: {
    ...mapState(useModalStore, ["activeModals"]),

    hasActiveModals(): boolean {
      return Object.keys(this.activeModals).length > 0;
    },

    sortedModals(): ModalState[] {
      return Object.values(this.activeModals).sort(
        (a, b) => a.openedAt - b.openedAt
      );
    },
  },
  methods: {
    closeModal(id: string): void {
      const store = useModalStore();
      store.closeModal(id);
    },
  },
});
</script>

<style scoped>
/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
