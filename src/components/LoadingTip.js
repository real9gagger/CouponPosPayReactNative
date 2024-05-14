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
            errMsg: "",
            isLoading: false
        }
        
        this.pageIndex = 1
        this.oldScrollTop = 0
        
        this.nextPage = this.__nextPage.bind(this)
        this.resetPage = this.__resetPage.bind(this)
        this.getPage = this.__getPage.bind(this)
        this.isFirstPage = this.__isFirstPage.bind(this)
        this.setLoading = this.__setLoading.bind(this)
        this.setNoMore = this.__setNoMore.bind(this)
        this.setErrMsg = this.__setErrMsg.bind(this)
        this.resetState = this.__resetState.bind(this)
        this.canLoadMore = this.__canLoadMore.bind(this)
        this.setScrollTop = this.__setScrollTop.bind(this)
        this.isScrollDown = this.__isScrollDown.bind(this)
    }
    
    __nextPage(){
        this.pageIndex++
    }
    __resetPage(){
        this.pageIndex = 1
    }
    __getPage(){
        return this.pageIndex
    }
    __isFirstPage(){
        return (this.pageIndex === 1)
    }
    __setLoading(bo){
        this.setState({ 
            noMore: 0,
            errMsg: "",
            isLoading: !!bo
        })
    }
    //判断已经加载的条数是否大于总条数
    __setNoMore(totalCount, dataLength){
        this.setState({ 
            noMore: (dataLength >= totalCount ? (totalCount===0 ? 2 : 1) : 0), 
            errMsg: "",
            isLoading: false
        })
    }
    __setErrMsg(txt){
        this.setState({ 
            noMore: 0,
            errMsg: (txt ? txt.toString() : ""),
            isLoading: false
        })
    }
    __resetState(){
        this.setState({
            noMore: 0,
            errMsg: "",
            isLoading: false
        })
        
        this.state.errMsg = ""
        this.state.noMore = 0
        this.state.isLoading = false
        
        this.pageIndex = 1
        this.oldScrollTop = 0
    }
    __canLoadMore(){
        return !this.state.isLoading && !this.state.noMore
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
                if(this.state.isLoading || this.props.alwaysShowLoading){
                    return (<View style={styles.containerBox}><ActivityIndicator color={appMainColor} size={22} /></View>)
                } else {
                    return (<View style={styles.containerBox}><Text style={styles.tipText} onPress={this.props.onReadyTextPress}>{this.props.readyText}</Text></View>)
                }
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