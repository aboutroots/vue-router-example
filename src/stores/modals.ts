import { defineStore } from "pinia";
import { ModalEvent, ModalRegistry, ModalState } from "@/types/modals";
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
        eventListeners?: ModalRegistry[K]["eventListeners"];
      } = {}
    ) {
      const id = options.id || `${modalType}-${Date.now()}`;
      const modalComponent = this.getModalComponent(modalType);

      Vue.set(this.activeModals, id, {
        id,
        modalType,
        component: modalComponent,
        props: options.props || {},
        eventListeners: options.eventListeners || {},
        openedAt: Date.now(),
      });

      return id;
    },

    closeModal(id?: string) {
      if (id) {
        if (this.activeModals[id]) {
          const closeListener = this.activeModals[id].eventListeners?.close;
          if (closeListener) closeListener();
          Vue.delete(this.activeModals, id);
        }
      } else {
        Object.keys(this.activeModals).forEach((modalId) =>
          this.closeModal(modalId)
        );
      }
    },

    handleModalEvent(modalId: string, eventData: ModalEvent) {
      const modal = this.activeModals[modalId];
      if (!modal) return;

      const listener = modal.eventListeners?.[eventData.eventName];
      if (listener) {
        listener(...(eventData.args || []));
      }

      // If it's a close event, close the modal
      if (eventData.eventName === "close") {
        this.closeModal(modalId);
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
