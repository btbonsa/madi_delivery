import { Tabs } from 'expo-router'

export default function TabsLayout() {
  return (
    <>   
    <Tabs>
      <Tabs.Screen name="Login" />
      <Tabs.Screen name="SignUp" />
    </Tabs>
     </>
  )
}

