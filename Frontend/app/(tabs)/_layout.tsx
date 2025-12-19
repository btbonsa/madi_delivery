import { StyleSheet, Image, View } from "react-native";
import { Tabs } from "expo-router";
import { ScanFace, UserIcon } from "lucide-react-native";
const _layout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="Login"
        options={{
          tabBarIcon: () => (
            <ScanFace size={26} className="text-white mt shadow-sm" />
          ),
          headerStyle: {
            backgroundColor: "#ffffffff",
            height: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
          headerLeft: () => (
            <Image
              source={require("../../assets/images/rlogo.png")}
              style={{
                width: 50,
                height: 50,
                margin: 10,
                paddingStart: 20,
              }}
            />
          ),
          headerTitle: "Login",
          headerTitleStyle: {
            color: "#000000",
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
          },
          headerTitleAlign: "center",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#43A047",
            height: 60,
            padding: 10,
          },
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="signUp"
        options={{
          tabBarIcon: () => (
            <UserIcon
              size={26}
              className="text-white border border-white rounded-full mt shadow-md"
            />
          ),
          headerStyle: {
            backgroundColor: "#ffffffff",
            height: 100,
          },
          headerLeft: () => (
            <Image
              source={require("../../assets/images/rlogo.png")}
              style={{
                width: 50,
                height: 50,
                margin: 10,
                paddingStart: 20,
              }}
            />
          ),
          headerTitle: "SignUp",
          headerTitleStyle: {
            color: "#000000",
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
          },
          headerTitleAlign: "center",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#43A047",
            height: 60,
            padding: 10,
          },

          headerShown: true,
        }}
      />
    </Tabs>
  );
};

export default _layout;

const styles = StyleSheet.create({});
