import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="Login" />
      <Stack.Screen name="signup" options={{
          headerShown: true,
          title: "Sign Up",
          headerStyle: { backgroundColor: "#01852dff" },
          headerTintColor: "white",
          headerTitleStyle: { color: "white" },
          contentStyle: { backgroundColor: "#01852dff" },
        }}
      />
      <Stack.Screen
        name="student"
      />
    </Stack>
  );
}
