/* eslint-disable no-unused-vars */
import { Animated, StyleSheet, Text } from "react-native";
import React, { createContext, useContext, useState, useRef, ReactNode } from "react";

type ToastType = "info" | "success" | "error";

interface ToastContextProps {
  showToast: (msg: string, duration?: number, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [message, setMessage] = useState<string>("");
  const [type, setType] = useState<ToastType>("info");
  const [visible, setVisible] = useState<boolean>(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const showToast = (msg: string, duration: number = 2000, toastType: ToastType = "info") => {
    setMessage(msg);
    setType(toastType);
    setVisible(true);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setVisible(false);
      });
    }, duration);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {visible && (
        <Animated.View style={[styles.toast, styles[type], { opacity: fadeAnim }]}>
          <Text style={styles.text}>{message}</Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextProps => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 16,
  },
  info: {
    backgroundColor: "#333",
  },
  success: {
    backgroundColor: "green",
  },
  error: {
    backgroundColor: "red",
  },
});
