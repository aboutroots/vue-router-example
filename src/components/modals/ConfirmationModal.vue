<template>
  <div class="confirmation-modal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ title }}</h2>
      </div>

      <div class="modal-body">
        <p>{{ message }}</p>
      </div>

      <div class="modal-footer">
        <button @click="handleCancel" class="btn btn-cancel">Cancel</button>
        <button @click="handleConfirm" class="btn btn-confirm">Confirm</button>
      </div>
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
      // Emit confirm event for parent to handle
      this.$emit("close");

      // If onConfirm callback was provided, call it
      this.$emit("confirm");
    },

    handleCancel() {
      // Emit cancel event
      this.$emit("close");

      // If onCancel callback was provided, call it
      this.$emit("cancel");
    },
  },
});
</script>

<style scoped>
.confirmation-modal {
  background: white;
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.modal-header {
  margin-bottom: 20px;
}

.modal-body {
  margin-bottom: 20px;
}

.modal-footer {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.btn {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.btn-cancel {
  background-color: #e0e0e0;
  color: #333;
}

.btn-confirm {
  background-color: #4caf50;
  color: white;
}
</style>
