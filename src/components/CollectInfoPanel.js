import { Component } from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import PosPayIcon from "./PosPayIcon"

const styles = StyleSheet.create({
    paymentDetails: {
        paddingVertical: 10, 
        paddingHorizontal: 15,
        backgroundColor: "#eee", 
        marginHorizontal: 15, 
        marginBottom: -5, 
        marginTop: 10,
        borderRadius: 10
    }
})

//收款详情面板
class CollectInfoPanel extends Component {
    constructor(props) {
        super(props)
    }
    
    render(){
        if(this.props.visiable === false){
            return null
        }
        
        return (
            <View style={styles.paymentDetails}>
                <View style={fxHC}>
                    <Text style={[fs12, fxG1]}>{this.props.labelOrderAmout}</Text>
                    <Text style={fs12}><Text style={fwB}>{this.props.orderAmout}</Text> {this.props.currencyUnit}</Text>
                </View>
                <View style={this.props.taxRate > 0 ? fxHC : dpN}>{/* 小于等于0，表示不使用税收功能！ */}
                    <Text style={fs12}>{this.props.labelTax}</Text>
                    <Text style={[fs12, tc99, fxG1]}> ({this.props.taxRate}%)</Text>
                    <Text style={fs12}><Text style={fwB}>{this.props.finalTax}</Text> {this.props.currencyUnit}</Text>
                </View>
                <View style={fxHC}>
                    <Text style={[fs12, fxG1]}>{this.props.labelDiscount}</Text>
                    <Text style={[fs12, tcG0]}><Text style={fwB}>-{this.props.finalDiscount}</Text> {this.props.currencyUnit}</Text>
                </View>
                <TouchableOpacity style={fxHC} activeOpacity={0.5} onPress={this.props.onQuestion}>
                    <Text style={fs12}>{this.props.labelFinalAmount}</Text>
                    <PosPayIcon name="help-stroke" size={12} color={appMainColor} offset={5} />
                    <Text style={[fxG1, fs12, tcR0, taR]}><Text style={fwB}>{this.props.finalAmount}</Text> {this.props.currencyUnit}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default CollectInfoPanel