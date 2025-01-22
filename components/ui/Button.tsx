import { StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from "react-native";

export default function Button({title, onPress, btnStyle, textStyle}: {title: string, onPress?: () => void, btnStyle?: StyleProp<ViewStyle>, textStyle?: StyleProp<TextStyle>}) {
  return (
    <TouchableOpacity style={[styles.button, btnStyle]} onPress={onPress}>
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});