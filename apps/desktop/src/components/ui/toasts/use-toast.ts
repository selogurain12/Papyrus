import { useEffect, useState, type ReactNode, type RefAttributes } from "react";

import type { ToastActionElement, ToastProps } from "./toast";

const toastLimit = 1;
const toastRemoveDelay = 1_000_000;

interface ToasterToast extends Omit<RefAttributes<HTMLLIElement> & ToastProps, "ref"> {
  id: string;
  title?: string;
  description?: ReactNode;
  action?: ToastActionElement;
  variant?: "default" | "destructive" | "success" | "warning";
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const actionTypes = {
  addToast: "addToast",
  updateToast: "updateToast",
  dismissToast: "dismissToast",
  removeToast: "removeToast",
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["addToast"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["dismissToast"];
      toastId?: ToasterToast["id"];
    }
  | {
      type: ActionType["removeToast"];
      toastId?: ToasterToast["id"];
    }
  | {
      type: ActionType["updateToast"];
      toast: Partial<ToasterToast>;
    };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

// eslint-disable-next-line no-unused-vars
const listeners: ((state: State) => void)[] = [];

let memoryState: State = { toasts: [] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "addToast": {
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, toastLimit),
      };
    }

    case "updateToast": {
      return {
        ...state,

        toasts: state.toasts.map((element) =>
          element.id === action.toast.id ? { ...element, ...action.toast } : element
        ),
      };
    }

    case "dismissToast": {
      const { toastId } = action;

      // ! Side effects ! - This could be extracted into a dismissToast() action
      // but I'll keep it here for simplicity
      if (toastId === undefined) {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      } else {
        addToRemoveQueue(toastId);
      }

      return {
        ...state,

        toasts: state.toasts.map((element) =>
          element.id === toastId || toastId === undefined
            ? {
                ...element,
                open: false,
              }
            : element
        ),
      };
    }
    case "removeToast": {
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((element) => element.id !== action.toastId),
      };
    }

    default: {
      return state;
    }
  }
}

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

function addToRemoveQueue(toastId: string) {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "removeToast",
      toastId,
    });
  }, toastRemoveDelay);

  toastTimeouts.set(toastId, timeout);
}

type Toast = Omit<ToasterToast, "id">;

function toast({ ...props }: Toast) {
  const id = genId();

  function update(props: ToasterToast) {
    dispatch({
      type: "updateToast",
      toast: { ...props, id },
    });
  }
  function dismiss() {
    dispatch({ type: "dismissToast", toastId: id });
  }

  dispatch({
    type: "addToast",

    toast: {
      ...props,
      id,
      open: true,

      onOpenChange: (open) => {
        if (!open) {
          dismiss();
        }
      },
    },
  });

  return {
    id,
    dismiss,
    update,
  };
}

function useToast() {
  const [state, setState] = useState<State>(memoryState);

  useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,

    dismiss: (toastId?: string) => {
      dispatch({ type: "dismissToast", toastId });
    },
  };
}

export { useToast, toast, reducer };
