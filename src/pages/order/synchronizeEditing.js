import { useRef } from "react";
import { ScrollView, StyleSheet,TouchableHighlight, View, Text } from "react-native";
import { useI18N, useFailedOrders } from "@/store/getter";
import { dispatchUpdateFailedField } from "@/store/setter";
import PosPayIcon from "@/components/PosPayIcon";
import GradientButton from "@/components/GradientButton";

const styles = StyleSheet.create({
    fieldBox: {
        display: "flex",
        flexDirection: "row",
        paddingVertical: 16,
        borderBottomColor: "#e0e0e0",
        borderBottomWidth: StyleSheet.hairlineWidth
    },
});

//支持修改的字段
const editableFields = [
    "posId",
    "shopId",
    "amount",
    "tax",
    "discountAmount",
    "orderAmount",
    "couponCode",
    "distributorNumber",
    "paymentType"
];
const editFlag = "（手工修改过数据）";

export default function OrderSynchronizeEditing(props){
    const i18n = useI18N();
    const failedOrders = useFailedOrders();
    const herData = failedOrders[props.route.params.index];
    const editInfo = {
        valueKey: "",
        isNumber: false,
        oldValue: ""
    };
    
    const onEditDone = (newVal) => {        
        if(newVal != editInfo.oldValue){
            if(!herData.remark){
                herData.remark = editFlag;
            } else if(herData.remark.indexOf(editFlag) < 0){
                herData.remark += editFlag;
            }
            
            if(editInfo.isNumber){
                dispatchUpdateFailedField(herData.__fid, editInfo.valueKey, (+newVal || editInfo.oldValue));
            } else {
                dispatchUpdateFailedField(herData.__fid, editInfo.valueKey, newVal.trim());
            }
            
            //重置
            editInfo.valueKey = "";
            editInfo.isNumber = false;
            editInfo.oldValue = "";
        }
    };
    
    const onGotoEdit = (key) => {
        return function(){
            editInfo.valueKey = key;
            editInfo.isNumber = (typeof herData[key] === "number");
            editInfo.oldValue = (herData[key] || "");
            props.navigation.navigate("文本输入器", {
                defaultText: editInfo.oldValue.toString(),
                onGoBack: onEditDone,
                isNumberPad: editInfo.isNumber
            });
        }
    };
    
    const onConfirm = () => {
        props.navigation.goBack();
    }
    
    return (<ScrollView style={pgFF}>
        {!herData ? <Text style={[pdX, taC, fs16, tc99]}>{i18n["nodata"]}</Text> : <>
            {editableFields.map(vx =>
                <TouchableHighlight key={vx} style={pdHX} underlayColor="#eee" onPress={onGotoEdit(vx)}>
                    <View style={styles.fieldBox}>
                        <Text style={[fs14, fwB]}>{vx}</Text>
                        <Text style={[fs14, fxG1, pdLS, taR, tcR0, fwB]}>{herData[vx]}</Text>
                        <PosPayIcon name="edit-pen" color="#09f" offset={5} />
                    </View>
                </TouchableHighlight>
            )}
            <View style={pdX}>
                <Text style={[fs12, taC, tcAA]}>{i18n["order.failed.editing.tip"]}</Text>
                <GradientButton style={{marginTop: 40}} onPress={onConfirm}>{i18n["btn.done"]}</GradientButton>
            </View>
        </>}
    </ScrollView>);
}