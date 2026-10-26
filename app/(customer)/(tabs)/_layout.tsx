import { Pressable, Text, View } from "react-native";
import { Tabs } from "expo-router";
import type { BottomTabBarProps } from "expo-router/build/react-navigation/bottom-tabs";
import {
  ClipboardList,
  House,
  UserRound,
  Heart,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const visibleTabs = ["index", "favorites", "orders", "profile"] as const;
const tabLabels: Record<(typeof visibleTabs)[number], string> = {
  index: "Home",
  favorites: "For You",
  orders: "Orders",
  profile: "Profile",
};
const icons = {
  index: House,
  favorites: Heart,
  orders: ClipboardList,
  profile: UserRound,
};

function BottomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const menuRoutes = visibleTabs
    .map((name) => state.routes.find((route) => route.name === name))
    .filter((route) => route !== undefined);
  const activeRouteName = state.routes[state.index]?.name;
  const selectedTab =
    activeRouteName === "search" || activeRouteName === "cart"
      ? "index"
      : activeRouteName;

  return (
    <View
      className="w-full flex-row border-t border-[#EEEEEE] bg-white pt-1"
      style={{ paddingBottom: Math.max(insets.bottom, 4) }}
    >
      {menuRoutes.map((route) => {
        const name = route.name as (typeof visibleTabs)[number];
        const routeIndex = state.routes.findIndex(
          (candidate) => candidate.key === route.key,
        );
        const focused = route.name === selectedTab;
        const Icon = icons[name];
        const label = tabLabels[name];

        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityLabel={label}
            accessibilityState={{ selected: focused }}
            testID={descriptors[route.key]?.options.tabBarButtonTestID}
            className="min-h-[52px] flex-1 items-center justify-center"
            onPress={() => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });
              if (routeIndex !== state.index && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            }}
            onLongPress={() =>
              navigation.emit({ type: "tabLongPress", target: route.key })
            }
          >
            <Icon
              size={21}
              color={focused ? "#016938" : "#929292"}
              strokeWidth={focused ? 2.4 : 1.8}
            />
            <View className="mt-0.5">
              <View className="h-[15px] items-center justify-center">
                <Text
                  className={
                    "font-anaheim " +
                    `text-[11px] ${focused ? "font-semibold font-anaheim-semibold text-[#016938]" : "font-normal font-anaheim text-[#929292]"}`
                  }
                >
                  {label}
                </Text>
              </View>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function CustomerTabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "#FFFFFF",
          borderTopColor: "#EEEEEE",
          borderTopWidth: 1,
          elevation: 0,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="favorites" options={{ title: "For You" }} />
      <Tabs.Screen name="orders" options={{ title: "Orders" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      <Tabs.Screen name="cart" options={{ href: null, title: "Cart" }} />
      <Tabs.Screen name="search" options={{ href: null, title: "Search" }} />
    </Tabs>
  );
}
