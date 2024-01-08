import { View, Text, Modal, Animated, Easing, StyleSheet, TouchableOpacity } from "react-native"

function showAlert(){
    return (
        <Modal
            visible={true} 
            presentationStyle="overFullScreen" 
            animationType="none" 
            transparent={true} 
            statusBarTranslucent={true}
            hardwareAccelerated={true}
            onRequestClose={()=>1}></Modal>
    )
}