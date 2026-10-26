import type { ReactNode } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary";
  icon?: ReactNode;
};
export default function AppButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  variant = "primary",
  icon,
}: Props) {
  const primary = variant === "primary";
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      disabled={disabled || loading}
      onPress={onPress}
      className={
        "h-[56px] flex-row items-center justify-center rounded-2xl " +
        (primary ? "bg-[#016938]" : "border border-[#E9E9EF] bg-white") +
        (disabled || loading ? " opacity-60" : " active:opacity-85")
      }
    >
      {loading ? (
        <ActivityIndicator color={primary ? "#FFFFFF" : "#016938"} />
      ) : (
        <>
          <Text
            className={
              "font-anaheim " +
              ("text-[15px] font-bold font-anaheim-bold " +
                (primary ? "text-white" : "text-[#121222]"))
            }
          >
            {label}
          </Text>
          {icon ? <View className="ml-2">{icon}</View> : null}
        </>
      )}
    </Pressable>
  );
}
