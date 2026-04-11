import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BookOpen, CircleUserRound, Plus } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    backgroundColor: "#f9fafb",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  logoSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  subtitle: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  },
  actionBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
    shadowColor: "#000",
  },
  buttonBlue: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#3b82f6",
    borderRadius: 6,
    alignItems: "center",
    gap: 6,
  },
  buttonBlueText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },

  contentArea: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },

  /* MODAL */
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    maxHeight: "80%",
  },
});

type NavProp = NativeStackNavigationProp<RootStackParamList, "Home">;

export function ProjectPage() {
  const navigation = useNavigation<NavProp>();
  const [modalOpen, setModalOpen] = useState(false);

  const handleNavigateToLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        {/* Ligne 1 : Branding */}
        <View style={styles.brandRow}>
          <View style={styles.logoSection}>
            <View style={styles.logoBox}>
              <BookOpen size={24} color="white" />
            </View>

            <View>
              <Text style={styles.title}>Projet Papyrus</Text>
              <Text style={styles.subtitle}>Gérez vos documents efficacement.</Text>
            </View>
          </View>
        </View>

        {/* Ligne 2 : Actions */}
        <View style={styles.actionBar}>
          <TouchableOpacity
            style={styles.buttonBlue}
            onPress={() => {
              setModalOpen(true);
            }}
          >
            <Plus size={16} color="white" />
            <Text style={styles.buttonBlueText}>Nouveau projet</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleNavigateToLogin}>
            <CircleUserRound size={32} color="#4b5563" />
          </TouchableOpacity>
        </View>
      </View>

      {/* CONTENU */}
      <ScrollView contentContainerStyle={styles.contentArea}>
        <Text style={{ fontSize: 14, color: "#6b7280" }}>Liste des projets — À implémenter</Text>
      </ScrollView>

      {/* MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalOpen}
        onRequestClose={() => {
          setModalOpen(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={() => {
                setModalOpen(false);
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 16 }}>✕</Text>
            </TouchableOpacity>

            <ScrollView>
              <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 20 }}>
                Créer un nouveau projet
              </Text>

              {/* <CreateProjectForm setOpen={setModalOpen} /> */}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
