import React from 'react'
import { Tabs } from 'expo-router'
import { MenuIcon } from 'lucide-react-native'
import { router } from 'expo-router'
const _layout = () => {
  return (
    <Tabs>
      <Tabs.Screen name="StudentDashboard" options={{headerShown: false}}/>
      <Tabs.Screen name="profile" options={{headerShown: true, headerTitle: "Profile" , headerStyle: {
        backgroundColor: "#ffffffff",
        height: 100,
      },
      headerLeft: () => (
        <MenuIcon size={26} className="text-white mt shadow-sm" onPress={() => router.push("/students/StudentDashboard")} />
      ),
      }}/>
    </Tabs>
  )
 
  
}

export default _layout

