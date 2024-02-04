import { useEffect } from "react";
import { ScrollView, View, Button, StatusBar, Text, DevSettings } from "react-native";

export default function MineIndex(props){
    const restartApp = () => {
        DevSettings.reload();
    }
    
    return (
        <ScrollView>
            <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
            <Text style={fs20}>个人中心</Text>
            <Button title="跳转到我的账户" onPress={() => props.navigation.navigate("我的账户")} />
            <Button title="跳转到设置" onPress={() => props.navigation.navigate("设置页")} />
            <Button title="重启" onPress={restartApp} />
        </ScrollView>
    )
}