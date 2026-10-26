import { ActivityIndicator, Text, View } from "react-native";

export default function AuthLoading() {
  return (
    <View className="flex-1 items-center justify-center bg-[#F8F7F2]">
      <ActivityIndicator size="large" color="#016938" />
      <Text className="font-anaheim mt-4 text-sm font-medium font-anaheim-medium text-[#748078]">
        Restoring your session…
      </Text>
    </View>
  );
}
