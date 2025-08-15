import { View } from "react-native"
import { useTheme } from "react-native-paper"
import { ActivityIndicator } from "react-native"

export  const FullScreenLoader = () => {
    const {colors} = useTheme()

    return (
    <View style = {{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,

    }}>    
    
    <ActivityIndicator size={50}/>
    </View>
  )
}

export default FullScreenLoader
