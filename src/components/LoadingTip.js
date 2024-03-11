import { Component } from "react"
import { ActivityIndicator, View, Text, StyleSheet } from "react-native"
import PosPayIcon from "./PosPayIcon"

const styles = StyleSheet.create({
    containerBox: {
        padding: 15
    },
    tipText: {
        fontSize: 12,
        textAlign: "center",
        color: "#aaa"
    },
    errText: {
        fontSize: 12,
        color: "#f60",
        textAlign: "center"
    },
    retryText: {
        color: appMainColor,
        fontWeight: "bold"
    }
})

//加载提示：正在加载、加载出错、没有更多数据
class LoadingTip extends Component {
    constructor(props) {
        super(props)
        this.state = {
            noMore: 0, //0 -未知，1-没有更多了，2-暂无数据
            errMsg: ""
        }
        
        this.pageIndex = 1
        this.isLoading = false
        this.oldScrollTop = 0
        
        this.nextPage = this.__nextPage.bind(this)
        this.resetPage = this.__resetPage.bind(this)
        this.isFirstPage = this.__isFirstPage.bind(this)
        this.setLoading = this.__setLoading.bind(this)
        this.setNoMore = this.__setNoMore.bind(this)
        this.setErrMsg = this.__setErrMsg.bind(this)
        this.resetState = this.__resetState.bind(this)
        this.canLoad = this.__canLoad.bind(this)
        this.setScrollTop = this.__setScrollTop.bind(this)
        this.isScrollDown = this.__isScrollDown.bind(this)
    }
    
    __nextPage(){
        this.pageIndex++
    }
    __resetPage(){
        this.pageIndex = 1
    }
    __isFirstPage(){
        return (this.pageIndex === 1)
    }
    __setLoading(bo){
        this.isLoading = !!bo
        this.setState({ 
            noMore: 0,
            errMsg: ""
        })
    }
    __setNoMore(pageSize, dataLength){
        this.setState({ 
            noMore: (dataLength >= pageSize ? 0 : (this.pageIndex===1 && dataLength===0 ? 2 : 1)), 
            errMsg: ""
        })
        this.isLoading = false
    }
    __setErrMsg(txt){
        this.setState({ 
            noMore: 0,
            errMsg: (txt ? txt.toString() : "")
        })
        this.isLoading = false
    }
    __resetState(){
        this.setState({
            noMore: 0,
            errMsg: ""
        })
        this.state.errMsg = ""
        this.state.noMore = 0
        this.isLoading = false
        this.pageIndex = 1
        this.oldScrollTop = 0
    }
    __canLoad(){
        return !this.isLoading && !this.state.noMore
    }
    __setScrollTop(top){
        this.oldScrollTop = (+top || 0)
    }
    __isScrollDown(top){
        return (this.oldScrollTop < top)
    }
    
    render(){
        if(this.props.visible === false){
            return null
        }
        
        if(!this.state.errMsg){
            if(this.state.noMore){
                if(this.state.noMore === 1){
                    return (<View style={styles.containerBox}><Text style={styles.tipText}>{this.props.noMoreText}</Text></View>)
                } else {
                    return (
                        <View style={[fxVM, styles.containerBox]}>
                            <PosPayIcon name="barren-place" color={styles.tipText.color} size={60} />
                            <Text style={styles.tipText}>{this.props.noDataText}</Text>
                        </View>
                    )
                }
            } else {
                return (<View style={styles.containerBox}><ActivityIndicator color={appMainColor} size={22} /></View>)
            }
        } else {
            return (
                <View style={styles.containerBox}>
                    <Text style={styles.errText}><Text style={fwB}>{this.props.errorTitle}</Text>{this.state.errMsg}&emsp;<Text style={styles.retryText} onPress={this.props.onRetry}>[{this.props.retryLabel}]</Text></Text>
                </View>
            )
        }
    }
}

export default LoadingTip