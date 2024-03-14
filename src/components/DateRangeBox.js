import { Component } from "react"
import { TouchableOpacity, View, Text, StyleSheet } from "react-native"
import { formatDate } from "@/utils/helper"
import DatePicker from "react-native-date-picker"
import PosPayIcon from "./PosPayIcon"

const styles = StyleSheet.create({
    containerBox: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    dateBox: {
        backgroundColor: "#f6f6f6",
        borderRadius: 5,
        padding: 10,
        flex: 1
    },
    dateVal0: {
        fontSize: 14,
        color: "#999"
    },
    dateVal1: {
        fontSize: 14,
        color: "#333"
    },
    dividerBox: {
        marginHorizontal: 10,
        fontSize: 14
    },
    labelBox: {
        fontSize: 14,
        marginRight: 10
    },
    clearBox: {
        position: "absolute",
        right: 10,
        top: 12.5,
        zIndex: 9
    }
})

const dateRangeCaches = {} //日期缓存，放在突然销毁日期控件后，在此显示时无法显示上次选择的日期

const DEFAULT_DATE_FORMATTER = "yyyy/MM/dd"

export function clearDateRangeCache(pk){
    if(pk && dateRangeCaches[pk]){
        delete dateRangeCaches[pk]
    }
}

export function getDateRangeResults(pk, formatter1, formatter2){
    const output = ["", ""]
    const dates = dateRangeCaches[pk]
    
    if(!dates){
        return output;
    }
    
    if(dates[0]){
        output[0] = formatDate(dates[0], formatter1)
    }
    
    if(dates[1]){
        output[1] = formatDate(dates[1], formatter2 || formatter1)
    }

    return output
}

//日期范围选择框
class DateRangeBox extends Component {
    constructor(props) {
        super(props)
        
        const cacheData = dateRangeCaches[props.uniqueKey]

        this.todayDate = new Date()
        this.state = {
            dateNth: 0,
            beginDate: (cacheData ? cacheData[0] : null),
            endDate: (cacheData ? cacheData[1] : null),
            dateFormat1: (cacheData && cacheData[0] ? formatDate(cacheData[0], DEFAULT_DATE_FORMATTER) : ""),
            dateFormat2: (cacheData && cacheData[1] ? formatDate(cacheData[1], DEFAULT_DATE_FORMATTER) : "")
        }
        
        this.callOpenBeginDP = this.__openBeginDP.bind(this)
        this.callOpenEndDP = this.__openEndDP.bind(this)
        this.callCloseDP = this.__closeDP.bind(this)
        this.callClearBeginDate = this.__clearBeginDate.bind(this)
        this.callClearEndDate = this.__clearEndDate.bind(this)
        this.callConfirmDP = this.__confirmDP.bind(this)
        this.getPickResults = this.__getResults.bind(this) //函数由外部调用
    }
    
    __openBeginDP(){
        this.setState({ dateNth: 1 })
    }
    __openEndDP(){
        this.setState({ dateNth: 2 })
    }
    __closeDP(){
        this.setState({ dateNth: 0 })
    }
    __clearBeginDate(){
        this.setState({
            beginDate: null,
            dateFormat1: ""
        })
        if(this.props.uniqueKey){
            dateRangeCaches[this.props.uniqueKey] = [null, this.state.endDate]
        }
    }
    __clearEndDate(){
        this.setState({
            endDate: null,
            dateFormat2: ""
        })
        if(this.props.uniqueKey){
            dateRangeCaches[this.props.uniqueKey] = [this.state.beginDate, null]
        }
    }
    __confirmDP(val){
        if(this.state.dateNth === 1){
            this.setState({
                beginDate: val,
                dateFormat1: formatDate(val, DEFAULT_DATE_FORMATTER),
                dateNth: 0
            })
            if(this.props.uniqueKey){
                dateRangeCaches[this.props.uniqueKey] = [val, this.state.endDate]
            }
        } else {
            this.setState({
                endDate: val,
                dateFormat2: formatDate(val, DEFAULT_DATE_FORMATTER),
                dateNth: 0
            })
            if(this.props.uniqueKey){
                dateRangeCaches[this.props.uniqueKey] = [this.state.beginDate, val]
            }
        }
    }
    __getResults(formatter1, formatter2){
        const output = ["", ""]
        
        if(this.state.beginDate){
            if(!formatter1 || formatter1 === DEFAULT_DATE_FORMATTER){
                output[0] = this.state.dateFormat1
            } else {
                output[0] = formatDate(this.state.beginDate, formatter1)
            }
        }
        
        
        if(this.state.endDate){
            if(!formatter2 || formatter2 === DEFAULT_DATE_FORMATTER){
                output[1] = this.state.dateFormat2
            } else {
                output[1] = formatDate(this.state.endDate, formatter2)
            }
        }
        
        return output
    }
    
    render(){
        if(this.props.visible === false){
            return null
        }
        
        return (<>
            <View style={[styles.containerBox, this.props.style]}>
                {!!this.props.label && <Text style={styles.labelBox}>{this.props.label}</Text>}
                <TouchableOpacity style={styles.dateBox} activeOpacity={0.5} onPress={this.callOpenBeginDP}>
                    <Text style={this.state.beginDate ? styles.dateVal1 : styles.dateVal0}>{this.state.dateFormat1 || this.props.beginPlaceholder}</Text>
                    <PosPayIcon visible={!!this.state.beginDate} name="delete-x" color="#999" size={14} style={styles.clearBox} onPress={this.callClearBeginDate} />
                </TouchableOpacity>
                <Text style={styles.dividerBox}>~</Text>
                <TouchableOpacity style={styles.dateBox} activeOpacity={0.5} onPress={this.callOpenEndDP}>
                    <Text style={this.state.endDate ? styles.dateVal1 : styles.dateVal0}>{this.state.dateFormat2 || this.props.endPlaceholder}</Text>
                    <PosPayIcon visible={!!this.state.endDate} name="delete-x" color="#999" size={14} style={styles.clearBox} onPress={this.callClearEndDate} />
                </TouchableOpacity>
            </View>
            <DatePicker
                modal={true}
                date={(this.state.dateNth === 1 ? this.state.beginDate : this.state.endDate) || this.todayDate} 
                open={this.state.dateNth > 0} 
                minimumDate={this.state.dateNth === 2 ? this.state.beginDate : null}
                maximumDate={this.state.dateNth === 1 ? this.state.endDate : null}
                onCancel={this.callCloseDP}
                onConfirm={this.callConfirmDP}
                confirmText={this.props.confirmText}
                cancelText={this.props.cancelText}
                title={this.state.dateNth === 1 ? this.props.beginPlaceholder : this.props.endPlaceholder}
                theme="light"
                mode="date" />
        </>)
    }
}

export default DateRangeBox