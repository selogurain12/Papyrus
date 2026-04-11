import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "../context/query-client";
import { ToastProvider } from "../src/ui/toast";
import { AuthProvider } from "../context/auth-context";
import { LoginScreen } from "./authentification/login";
import { ProjectPage } from "./projects/project";
import { RegisterScreen } from "./authentification/register";

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={ProjectPage} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <SafeAreaProvider>
            <NavigationContainer>
              <RootStack />
            </NavigationContainer>
          </SafeAreaProvider>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
