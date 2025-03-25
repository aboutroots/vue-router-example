import { DefineComponent } from "vue";

// Generic interface for modal configuration
export interface ModalConfig<P = any, C = any> {
  component: DefineComponent;
  props?: P;
  callbacks?: {
    [K in keyof C]?: C[K];
  };
}

// Modal state in the store
export interface ModalState {
  id: string;
  component: Vue.Component;
  props?: any;
  callbacks?: Record<string, (...args: any[]) => void>;
  openedAt: number;
}

// Type-safe modal registry to help with type inference
export type ModalRegistry = {
  "user-details": ModalConfig<
    { userId: number },
    {
      onClose?: () => void;
      onUserAction?: (action: string) => void;
    }
  >;
  confirmation: ModalConfig<
    {
      title: string;
      message: string;
    },
    {
      onConfirm?: () => void;
      onCancel?: () => void;
    }
  >;
  // Add more modal types as needed
};
