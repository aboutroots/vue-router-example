<template>
  <div class="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold text-gray-800">User Details</h2>
      <button
        @click="closeModal"
        class="text-gray-400 hover:text-gray-600 transition-colors duration-200"
      >
        <span class="text-2xl">&times;</span>
      </button>
    </div>

    <div class="mb-6">
      <p class="text-gray-600">
        Received ID: <span class="font-medium text-gray-800">{{ userId }}</span>
      </p>
      <p class="text-gray-600">
        Received Name:
        <span class="font-medium text-gray-800">{{ userName }}</span>
      </p>
    </div>

    <div class="flex justify-center">
      <button
        @click="openStackedModal"
        class="px-4 py-2 text-white bg-gray-800 rounded-md hover:bg-gray-700 transition-colors duration-200 font-medium"
      >
        Click this to open another stacked modal
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { useModalStore } from "@/stores/modals";

export default Vue.extend({
  name: "UserDetailsModal",
  props: {
    userId: {
      type: Number,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
  },
  methods: {
    closeModal() {
      this.$emit("modal-event", {
        eventName: "close",
      });
    },

    openStackedModal() {
      const modalStore = useModalStore();
      modalStore.openModal("confirmation", {
        props: {
          title: "Stacked Modal",
          message: "This is a stacked modal opened from UserDetailsModal",
        },
        eventListeners: {
          confirm: () => {
            console.log(
              "Stacked modal confirmed! - this is being called from the first modal"
            );
            this.closeModal();
          },
        },
      });
    },
  },
});
</script>
