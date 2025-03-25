<template>
  <div class="user-details-modal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>User Details</h2>
        <button @click="closeModal" class="close-btn">&times;</button>
      </div>

      <div v-if="loading" class="loading">Loading user details...</div>

      <div v-else-if="user" class="user-info">
        <div class="user-avatar">
          <img :src="user.avatarUrl" :alt="user.name" />
        </div>

        <div class="user-details">
          <p><strong>Name:</strong> {{ user.name }}</p>
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p><strong>Role:</strong> {{ user.role }}</p>
        </div>

        <div class="user-actions">
          <button @click="performUserAction('edit')" class="btn btn-edit">
            Edit Profile
          </button>
          <button @click="performUserAction('delete')" class="btn btn-delete">
            Delete User
          </button>
        </div>
      </div>

      <div v-else class="error">Could not load user details.</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { useModalStore } from "@/stores/modals";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatarUrl: string;
}

export default Vue.extend({
  name: "UserDetailsModal",
  props: {
    userId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      user: null as User | null,
      loading: true,
      error: null as Error | null,
    };
  },
  async created() {
    try {
      // Simulated API call to fetch user details
      this.user = await this.fetchUserDetails(this.userId);
    } catch (err) {
      this.error =
        err instanceof Error ? err : new Error("Failed to load user");
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async fetchUserDetails(userId: number): Promise<User> {
      // Replace with actual API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: userId,
            name: "John Doe",
            email: "john.doe@example.com",
            role: "Developer",
            avatarUrl: "https://via.placeholder.com/150",
          });
        }, 1000);
      });
    },

    closeModal() {
      // Trigger the onClose callback if it exists
      this.$emit("close");
    },

    performUserAction(action: "edit" | "delete") {
      // This will trigger the onUserAction callback passed when opening the modal
      // Emit an event that can be handled by the parent/store
      this.$emit("userAction", action);

      if (action === "delete") {
        // Optionally show a confirmation before delete
        const modalStore = useModalStore();
        modalStore.openModal("confirmation", {
          props: {
            title: "Delete User",
            message: "Are you sure you want to delete this user?",
          },
          callbacks: {
            onConfirm: () => {
              // Perform actual delete logic
              console.log(`Deleting user ${this.userId}`);
              this.closeModal();
            },
          },
        });
      }
    },
  },
});
</script>

<style scoped>
.user-details-modal {
  background: white;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.user-avatar img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 20px;
}

.user-details {
  text-align: center;
  margin-bottom: 20px;
}

.user-actions {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-edit {
  background-color: #4caf50;
  color: white;
}

.btn-delete {
  background-color: #f44336;
  color: white;
}

.loading,
.error {
  text-align: center;
  padding: 20px;
}
</style>
