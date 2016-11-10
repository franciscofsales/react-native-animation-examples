import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Animated,
  Easing,
  TouchableWithoutFeedback,
  PanResponder
} from 'react-native';

export default class reactNativeAnimationExample extends Component {
  constructor(props){
    super(props);
    this.handlePressIn = this.handlePressIn.bind(this);
    this.handlePressOut = this.handlePressOut.bind(this);
  }
  componentWillMount() {
    // button
    this.animatedValue = new Animated.Value(1);

    // drag box
    this.panAnimatedValue = new Animated.ValueXY();
    this._panValue = {x:0, y:0};
    this.panAnimatedValue.addListener((value) => {this._panValue = value});
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderGrant: (e, gestureState) => {
        this.panAnimatedValue.setOffset({
          x: this._panValue.x,
          y: this._panValue.y
        });
        this.panAnimatedValue.setValue({x:0, y:0});
      },
      onPanResponderMove: Animated.event([
        null,
        {dx: this.panAnimatedValue.x, dy: this.panAnimatedValue.y}
      ]),
      onPanResponderRelease: (e, gestureState) => {
        this.panAnimatedValue.flattenOffset();
        Animated.decay(this.panAnimatedValue, {
          deceleration: 0.993,
          velocity:{x:gestureState.vx, y:gestureState.vy}
        }).start();
      }
    });

    // COlor animation
    this.colorAnimatedValue = new Animated.Value(0);

  }

  componentDidMount() {
    //color animation
    Animated.timing(this.colorAnimatedValue, {
      toValue: 150,
      duration: 2500
    }).start();
  }

  // Button
  handlePressIn() {
    Animated.spring( this.animatedValue, {
      toValue: 0.5
    }).start();
  }

  handlePressOut() {
    Animated.spring( this.animatedValue, {
      toValue: 1,
      friction: 3,
      tension: 40
    }).start();
  }

  //----

  render() {
    // button
    const animatedStyle = {
      transform: [
        {scale: this.animatedValue}
      ]
    };
    // Drag button
    const panAnimatedStyle = {
      transform: this.panAnimatedValue.getTranslateTransform()
    };
    //color animation
    const interpolateColor = this.colorAnimatedValue.interpolate({
      inputRange: [0, 150],
      outputRange: ['rgb(0, 0, 0)', 'rgb(52, 250, 170)']
    });
    const colorAnimatedStyle = {
      backgroundColor: interpolateColor,
      transform: [
        {translateX: this.colorAnimatedValue}
      ]
    };

    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback
          onPressIn={this.handlePressIn}
          onPressOut={this.handlePressOut}
        >
          <Animated.View style={[styles.box, animatedStyle]}>
            <Text style={styles.textStyle}>Press me</Text>
          </Animated.View>
        </TouchableWithoutFeedback>

        <Animated.View style={[styles.box, panAnimatedStyle]} {...this.panResponder.panHandlers}>
          <Text style={styles.textStyle}>Drag me</Text>
        </Animated.View>

        <Animated.View style={[styles.box, colorAnimatedStyle]}>
          <Text style={styles.textStyle}>Check my color</Text>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:30,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  box: {
    width: 100,
    height: 50,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    color: 'white'
  }
});

AppRegistry.registerComponent('reactNativeAnimationExample', () => reactNativeAnimationExample);
