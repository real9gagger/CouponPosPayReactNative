import { useEffect, useState, useRef } from "react";
import { ScrollView, View, Image, Text, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { useI18N, getAppSettings } from "@/store/getter";
import { DISCOUNT_TYPE_LJ } from "@/common/Statics";
import LinearGradient from "react-native-linear-gradient"
import PayKeyboard from "@/components/PayKeyboard";
import PosPayIcon from "@/components/PosPayIcon";
import GradientButton from "@/components/GradientButton";
import LocalPictures from "@/common/Pictures";
import QRcodeScanner from "@/modules/QRcodeScanner";

const styles = StyleSheet.create({
    
});

export default function OrderStatistics(props){
    return (
        <ScrollView style={pgEE} contentContainerStyle={[mhF, pdHX]}>
            
        </ScrollView>
    );
}