<template>
  <div class="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-gray-800">{{ title }}</h2>
    </div>

    <div class="mb-6">
      <p class="text-gray-600">{{ message }}</p>
    </div>

    <div class="flex justify-center space-x-4">
      <button
        @click="handleCancel"
        class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200 font-medium"
      >
        Cancel
      </button>
      <button
        @click="handleConfirm"
        class="px-4 py-2 text-white bg-gray-800 rounded-md hover:bg-gray-700 transition-colors duration-200 font-medium"
      >
        Confirm
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "ConfirmationModal",
  props: {
    title: {
      type: String,
      default: "Confirm Action",
    },
    message: {
      type: String,
      default: "Are you sure you want to proceed?",
    },
  },
  methods: {
    handleConfirm() {
      this.$emit("modal-event", {
        eventName: "confirm",
      });
      this.$emit("modal-event", {
        eventName: "close",
      });
    },

    handleCancel() {
      this.$emit("modal-event", {
        eventName: "cancel",
      });
      this.$emit("modal-event", {
        eventName: "close",
      });
    },
  },
});
</script>
