import { useEffect, useRef, useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useI18N, getAppSettings } from "@/store/getter";
import { dispatchUpdateAppSettings } from "@/store/setter";
import { allPayTypeMap } from "@/common/Statics";
import { refreshSupportPaymentMap, isSupportPayType } from "@/modules/PaymentHelper";
import GradientButton from "@/components/GradientButton";
import TextualButton from "@/components/TextualButton";
import PosPayIcon from "@/components/PosPayIcon";

const styles = StyleSheet.create({
    itemBox: {
        paddingVertical: 8,
        borderBottomColor: "#ccc",
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    btnBox0: {
        opacity: 0.2,
        padding: 10
    },
    btnBox1: {
        padding: 10
    },
    txtBtn: {
        color: appLightColor,
        marginVertical: 20,
        paddingVertical: 10,
        fontSize: 12
    }
});

export default function SettingPayTypeTabs(props){
    const i18n = useI18N();
    const isWarned = useRef(false); //启用或停用支付方式前，是否已弹窗警告框！
    const initHash = useRef(""); //初始哈希值，用于检查是否有项目被改变了
    const [payTypeList, setPayTypeList] = useState([]);
    const lastOne = payTypeList.length - 1;
    
    const resetActived= (idx) => {
        payTypeList[idx].activeco = null; //active color
        setPayTypeList([...payTypeList]);
    }
    const onMoveUp = (idx) => {
        return function(){
            if(idx > 0){
                const tempItem = payTypeList[idx];
                
                payTypeList.forEach((pp, ii) => (pp.activeco = (idx===ii ? appMainColor : null)));
                payTypeList[idx] = payTypeList[idx - 1];
                payTypeList[idx - 1] = tempItem;
                
                setPayTypeList([...payTypeList]);
                $debounce(resetActived, 1500, idx - 1);
            }
        }
    }
    const onMoveDown = (idx) => {
        return function(){
            if(idx < lastOne){
                const tempItem = payTypeList[idx];
                
                payTypeList.forEach((pp, ii) => (pp.activeco = (idx===ii ? appMainColor : null)));
                payTypeList[idx] = payTypeList[idx + 1];
                payTypeList[idx + 1] = tempItem;
                
                setPayTypeList([...payTypeList]);
                $debounce(resetActived, 1500, idx + 1);
            }
        }
    }
    const onSetDisabled = (idx) => {
        return async function(){
            let isContinue = true;
            
            if(!isWarned.current){
                await $confirm(i18n["setting.paytype.tip"], i18n["alert.title"], i18n["btn.ok"], i18n["btn.continue"]).then(() => {
                    isContinue = isWarned.current = true;
                }).catch(() => {
                    isContinue = false;
                });
            }
            
            if(isContinue){
                const acColor = (payTypeList[idx].disabled ? tcG0.color : tcCC.color);
                
                payTypeList.forEach((pp, ii) => (pp.activeco = (idx===ii ? acColor : null)));
                payTypeList[idx].disabled = !payTypeList[idx].disabled;
                
                setPayTypeList([...payTypeList]);
                $debounce(resetActived, 500, idx);
            }
        }
    }
    const onConfirm = () => {
        const existsIndex = payTypeList.findIndex(vxo => !vxo.disabled);
        if(existsIndex < 0){
            return !$notify.error(i18n["setting.paytype.errmsg1"]);
        }
        
        payTypeList.forEach(vxo => {
            for(const kk in vxo){
                switch(kk){
                    case "tabkey":
                    case "pmtype":
                    case "disabled": break;
                    default: delete vxo[kk]; break; //删除用不到的数据，以便节省存储空间
                }
            }
        });
        
        dispatchUpdateAppSettings("homePayTypeTabs", payTypeList);
        
        props.navigation.goBack();
    }
    const onRefreshPayments = () => {
        refreshSupportPaymentMap().then(() => {
            let diffCount = 0;
            for(const pt of payTypeList){
                const newVal = !isSupportPayType(pt.pmtype);
                if(pt.disabled !== newVal){
                    pt.disabled = newVal;
                    diffCount++;
                }
            }
            if(diffCount){
                setPayTypeList([...payTypeList]);
            }
            $toast(i18n["updated"]);
        });
    }
    const nothingChanged = () => {
        const newHash = payTypeList.map(vxo => (vxo.pmtype + vxo.disabled)).join();
        return (initHash.current === newHash);
    }

    useEffect(() => {
        const ptl = [];
        const tabs = getAppSettings("homePayTypeTabs");
        
        if(!tabs || !tabs.length){
            for(const kk in allPayTypeMap){
                ptl.push({
                    tabkey: kk,
                    disabled: false,
                    ...allPayTypeMap[kk]
                });
            }
        } else {
            for(const vxo of tabs){
                const item = allPayTypeMap[vxo.tabkey];
                if(item){
                    ptl.push({...vxo, ...item});
                }
            }
        }
        
        initHash.current = ptl.map(vxo => (vxo.pmtype + vxo.disabled)).join();
        
        setPayTypeList(ptl);
    }, []);
    
    return (
        <View style={[pgFF, pdHX]}>
            {payTypeList.map((vx, ix) => 
                <View key={ix} style={[fxHC, styles.itemBox]}>
                    <PosPayIcon name={vx.pticon} color={vx.activeco} size={18} offset={-5} />
                    <Text style={[fxG1, fs16, {color: vx.activeco}]}>{i18n[vx.ptname]}</Text>
                    <TouchableOpacity style={ix===0 ? styles.btnBox0 : styles.btnBox1} activeOpacity={0.3} onPress={onMoveUp(ix)}>
                        <PosPayIcon name="move-up" color={appMainColor} size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity style={ix===lastOne ? styles.btnBox0 : styles.btnBox1} activeOpacity={0.3} onPress={onMoveDown(ix)}>
                        <PosPayIcon name="move-down" color={appMainColor} size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnBox1} activeOpacity={0.3} onPress={onSetDisabled(ix)}>
                        <PosPayIcon name="check-enabled" color={vx.disabled ? tcCC.color : tcG0.color} size={20} />
                    </TouchableOpacity>
                </View>
            )}
            <GradientButton disabled={nothingChanged()} style={{marginTop: 60}} onPress={onConfirm}>{i18n["btn.apply"]}</GradientButton>
            <TextualButton style={styles.txtBtn} onPress={onRefreshPayments}>{i18n["setting.paytype.refresh"]}</TextualButton>
        </View>
    );
}