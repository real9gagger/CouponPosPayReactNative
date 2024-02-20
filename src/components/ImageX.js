import { Component } from "react"
import { Image, StyleSheet } from "react-native"


//自动调整高度的图片组件
class ImageX extends Component {
    
    constructor(props) {
        super(props)
        
        this.state = {
            finalSize: null
        }
        
        this.layoutHeight = 0
        this.layoutWidth = 0
        
        this.callOnImageLoad = this.onImageLoad.bind(this)
        this.callOnImageLayout = this.onImageLayout.bind(this)
    }
    
    //图片加载完成后重新调整宽高
    onImageLoad(evt){
        const so = evt.nativeEvent.source
        if(!this.layoutWidth){
            if(!this.layoutHeight){
                this.setState({finalSize: { 
                    height: so.height, 
                    width: so.width
                }})
            } else {
                this.setState({finalSize: {
                    height: this.layoutHeight, 
                    width: this.layoutHeight * so.width / so.height
                }})
            }
        } else {
            if(!this.layoutHeight){
                this.setState({finalSize: {
                    height: this.layoutWidth * so.height / so.width, 
                    width: this.layoutWidth
                }})
            } else {
                this.setState({finalSize: {
                    height: this.layoutHeight, 
                    width: this.layoutWidth
                }})
            }
        }
    }
    
    onImageLayout(evt){
        if(!this.state.finalSize){
            const lo = evt.nativeEvent.layout
            this.layoutHeight = lo.height
            this.layoutWidth = lo.width
        }
    }
    
    render(){
        
        if(this.props.visible === false){
            return null
        }
        
        const imgStyle = (Array.isArray(this.props.style) ? StyleSheet.flatten(this.props.style) : this.props.style)
        
        return (<Image
            source={{ uri: this.props.src }}
            style={[imgStyle, this.state.finalSize]}
            resizeMode="contain"
            onLoad={this.callOnImageLoad}
            onLayout={this.callOnImageLayout}
            onError={this.props.onError}
        />)
    }
}

export default ImageX