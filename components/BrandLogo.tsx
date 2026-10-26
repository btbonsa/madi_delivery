import { Image } from "expo-image";
import { View } from "react-native";

type BrandLogoProps = { size?: number };

export default function BrandLogo({ size = 44 }: BrandLogoProps) {
  return (
    <View
      accessibilityLabel="LocalBite"
      className="overflow-hidden rounded-2xl bg-green-600 border border-emerald-900/10 shadow-sm"
      style={{ width: size, height: size }}
    >
      <Image
        source={require("../assets/images/logo1.png")}
        contentFit="cover"
        transition={170}
        style={{ width: "100%", height: "100%" }}
      />
    </View>
  );
}