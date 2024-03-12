import { Component } from "react"

//带有判断条件的片段元素
class FragmentX extends Component {
    render(){
        if(!this.props.if){
            return null;
        }
        
        return this.props.children;
    }
}

export default FragmentX