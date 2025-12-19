import { StyleSheet, Text, View } from 'react-native'
import { Tabs} from 'expo-router'

const _layout = () => {
  return (
    <Tabs>
      <Tabs.Screen name="Login" />
      <Tabs.Screen name="signup" />
    </Tabs>
  )
}

export default _layout

const styles = StyleSheet.create({})