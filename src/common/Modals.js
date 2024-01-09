import { View, Text, Modal, Animated, Easing, StyleSheet, TouchableOpacity } from "react-native"
import { Component } from 'react'

class PortalConsumer extends React.Component {
  constructor(props) {
    super(props)
    this._key = null
  }
  
  componentDidMount() {
    if (!this.props.manager) {
        throw new Error('Looks like you forgot to wrap your root component with `Provider` component from `@ant-design/react-native`.\n\n')
    }
    this._key = this.props.manager.mount(this.props.children)
  }

  componentDidUpdate() {
    this.props.manager.update(this._key, this.props.children)
  }

  componentWillUnmount() {
    this.props.manager.unmount(this._key)
  }

  render() {
    return null
  }
}

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