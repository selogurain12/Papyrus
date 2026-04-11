import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { BookOpen } from "lucide-react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginDto, loginSchema } from "@papyrus/source";
import { useNavigation } from "@react-navigation/native";
import { isFetchError } from "@ts-rest/react-query/v5";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../../context/auth-context";
import { client } from "../../utils/clients/client";
import { useToast } from "../ui/toast";
import { RootStackParamList } from "../App";

type NavProp = NativeStackNavigationProp<RootStackParamList, "Login">;

export function LoginScreen() {
  const navigation = useNavigation<NavProp>();
  const { showToast } = useToast();
  const { setToken, setUser } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate } = client.authentification.login.useMutation({
    onSuccess: ({ body }) => {
      showToast("Vous êtes connecté", 2000, "success");
      void setToken(body.token);
      void setUser(body.user);
      navigation.navigate("Home");
    },
    onError: (error) => {
      if (isFetchError(error)) {
        showToast(error.message, 2000, "error");
      } else {
        showToast("Une erreur est survenue", 2000, "error");
      }
    },
  });

  function onSubmit(data: LoginDto) {
    mutate({ body: data });
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.logoBox}>
          <BookOpen size={32} color="white" />
        </View>
        <Text style={styles.title}>Bienvenue sur Papyrus</Text>
        <Text style={styles.subtitle}>Connectez-vous pour continuer</Text>
      </View>

      {/* CARD */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Connexion</Text>

        {/* EMAIL */}
        <Text style={styles.label}>Email</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => {
            return (
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={value}
                onChangeText={onChange}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            );
          }}
        />
        {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

        {/* PASSWORD */}
        <Text style={styles.label}>Mot de passe</Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => {
            return (
              <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                value={value}
                onChangeText={onChange}
                secureTextEntry
              />
            );
          }}
        />
        {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

        {/* BUTTON */}
        <TouchableOpacity style={styles.button} onPress={() => void handleSubmit(onSubmit)()}>
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>

        {/* LINK */}
        <Text style={styles.linkText}>
          Pas encore de compte ?{" "}
          <Text
            style={styles.link}
            onPress={() => {
              navigation.navigate("Register");
            }}
          >
            S'inscrire
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  header: {
    alignItems: "center",
    marginBottom: 30,
  },

  logoBox: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
    textAlign: "center",
  },

  card: {
    width: "100%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 6,
  },

  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    backgroundColor: "#f9fafb",
    marginBottom: 8,
  },

  error: {
    color: "#dc2626",
    fontSize: 12,
    marginBottom: 8,
  },

  button: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 16,
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },

  linkText: {
    textAlign: "center",
    color: "#6b7280",
  },

  link: {
    color: "#2563eb",
    fontWeight: "600",
  },
});
