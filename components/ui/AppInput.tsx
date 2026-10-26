import type { ReactNode } from "react";
import { Text, TextInput, View } from "react-native";
import type { KeyboardTypeOptions, TextInputProps } from "react-native";
import type { LucideIcon } from "lucide-react-native";
type Props = {
  label: string;
  icon: LucideIcon;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: TextInputProps["autoCapitalize"];
  autoComplete?: TextInputProps["autoComplete"];
  secureTextEntry?: boolean;
  maxLength?: number;
  returnKeyType?: TextInputProps["returnKeyType"];
  onSubmitEditing?: TextInputProps["onSubmitEditing"];
  rightSlot?: ReactNode;
};
export default function AppInput({
  label,
  icon: Icon,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize,
  autoComplete,
  secureTextEntry,
  maxLength,
  returnKeyType,
  onSubmitEditing,
  rightSlot,
}: Props) {
  return (
    <View>
      <Text className="font-anaheim mb-2 text-[13px] font-semibold font-anaheim-semibold text-[#343449]">
        {label}
      </Text>
      <View className="h-[56px] flex-row items-center rounded-2xl border border-[#E9E9EF] bg-white px-4">
        <Icon size={18} color="#858592" strokeWidth={1.9} />
        <TextInput
          className="font-anaheim ml-3 flex-1 py-3 text-[15px] text-[#121222]"
          placeholder={placeholder}
          placeholderTextColor="#A4A4AF"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          secureTextEntry={secureTextEntry}
          maxLength={maxLength}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
        />
        {rightSlot}
      </View>
    </View>
  );
}
