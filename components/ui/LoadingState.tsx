import { ActivityIndicator, Text, View } from "react-native";

export default function LoadingState({ label }: { label: string }) {
  return (
    <View className="items-center rounded-2xl border border-slate-100 bg-white px-6 py-8 shadow-sm">
      <ActivityIndicator size="small" color="#016938" />
      <Text className="font-anaheim mt-3 text-xs font-medium text-slate-500">
        {label}
      </Text>
    </View>
  );
}