import { defineStore } from "pinia";
import { ModalRegistry, ModalState } from "@/types/modals";
import UserDetailsModal from "@/components/modals/UserDetailsModal.vue";
import ConfirmationModal from "@/components/modals/ConfirmationModal.vue";
import Vue from "vue";

export const useModalStore = defineStore("modals", {
  state: () => ({
    activeModals: {} as Record<string, ModalState>,
  }),

  actions: {
    openModal<K extends keyof ModalRegistry>(
      modalType: K,
      options: {
        id?: string;
        props?: ModalRegistry[K]["props"];
        callbacks?: ModalRegistry[K]["callbacks"];
      } = {}
    ) {
      const id = options.id || `${modalType}-${Date.now()}`;
      const modalComponent = this.getModalComponent(modalType);

      Vue.set(this.activeModals, id, {
        id,
        component: modalComponent,
        props: options.props || {},
        callbacks: options.callbacks || {},
        openedAt: Date.now(),
      });

      return id;
    },

    closeModal(id?: string) {
      if (id) {
        if (this.activeModals[id]) {
          const closeCallback = this.activeModals[id].callbacks?.onClose;
          if (closeCallback) closeCallback();
          Vue.delete(this.activeModals, id);
        }
      } else {
        Object.keys(this.activeModals).forEach((modalId) =>
          this.closeModal(modalId)
        );
      }
    },

    getModalComponent(modalType: keyof ModalRegistry) {
      const modalComponents = {
        "user-details": UserDetailsModal,
        confirmation: ConfirmationModal,
      };
      return modalComponents[modalType];
    },
  },
});
