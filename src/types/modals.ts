import { DefineComponent } from "vue";

// Generic interface for modal configuration
export interface ModalConfig<P = any, E = any> {
  component: DefineComponent;
  props?: P;
  eventListeners?: {
    [K in keyof E]?: E[K];
  };
}

// Modal state in the store
export interface ModalState {
  id: string;
  modalType: keyof ModalRegistry;
  component: Vue.Component;
  props?: any;
  eventListeners?: Record<string, (...args: any[]) => void>;
  openedAt: number;
}

// Type-safe modal registry to help with type inference
export type ModalRegistry = {
  "user-details": ModalConfig<
    { userId: number; userName: string },
    {
      close?: () => void;
      userAction?: (action: string) => void;
    }
  >;
  confirmation: ModalConfig<
    {
      title: string;
      message: string;
    },
    {
      close?: () => void;
      confirm?: () => void;
      cancel?: () => void;
    }
  >;
  // Add more modal types as needed
};

export type ModalEvent = {
  eventName: string;
  args?: any[];
};
