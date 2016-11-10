import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Animated,
  Easing,
  TouchableWithoutFeedback,
  PanResponder,
  Dimensions
} from 'react-native';

const {height} = Dimensions.get("window");

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

    // spinner
    this.spinnerAnimatedValue = new Animated.Value(0);


    // squeuence
    this.animatedValueOne = new Animated.Value(0);
    this.animatedValueTwo = new Animated.Value(1);

    //stagger
    this.animatedValue1 = new Animated.Value(0);
    this.animatedValue2 = new Animated.Value(0);
    this.animatedValue3 = new Animated.Value(0);

    //multiple
    this.multipleAnimatedValue1 = new Animated.Value(0);
    this.multipleAnimatedValue2 = new Animated.Value(1);
  }

  componentDidMount() {
    //color animation
    Animated.timing(this.colorAnimatedValue, {
      toValue: 150,
      duration: 2500
    }).start();

    //spinner
    Animated.timing(this.spinnerAnimatedValue,{
      toValue: 1,
      duration: 1500,
      easing: Easing.elastic(1)
    }).start();

    //sequence
    Animated.sequence([
      Animated.timing(this.animatedValueOne, {
        toValue: 75,
        duration: 1000
      }),
      Animated.spring(this.animatedValueTwo, {
        toValue: 1.5,
      }),
      Animated.timing(this.animatedValueOne, {
        toValue: 0,
        duration: 1000
      }),
      Animated.spring(this.animatedValueTwo, {
        toValue: 0.5,
      }),
    ]).start();


    //stagger
    Animated.stagger(300, [
      Animated.timing(this.animatedValue1, {
        toValue:50,
        duration:1500
      }),
      Animated.timing(this.animatedValue2, {
        toValue:50,
        duration:1500
      }),
      Animated.timing(this.animatedValue3, {
        toValue:50,
        duration:1500
      }),
    ]).start();

    //multiple
    Animated.parallel([
      Animated.timing(this.multipleAnimatedValue1, {
        toValue: 30,
        duration: 300
      }),
      Animated.spring(this.multipleAnimatedValue2,{
        toValue: 1.3
      })
    ]).start();
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
    };

    //spinner
    const interpolateRotation = this.spinnerAnimatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    });
    const spinnerAnimatedStyle = {
      transform: [
        {rotate: interpolateRotation}
      ]
    }


    //sequence
    const sequenceAnimatedStyle = {
      transform:[
        { translateX: this.animatedValueOne },
        { scale: this.animatedValueTwo}
      ]
    };

    //stagger
    const staggerAnimatedStyle1 = {
      height: this.animatedValue1
    }
    const staggerAnimatedStyle2 = {
      height: this.animatedValue2
    }
    const staggerAnimatedStyle3 = {
      height: this.animatedValue3
    }

    //multiple
    const multipleAnimatedStyle = {
      transform:[
        { translateX: this.multipleAnimatedValue1 },
        { scale: this.multipleAnimatedValue2 }
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

        <Animated.View style={[styles.box, spinnerAnimatedStyle]}>
          <Text style={styles.textStyle}>Check my rotation</Text>
        </Animated.View>

        <Animated.View style={[styles.box, sequenceAnimatedStyle]}>
          <Text style={styles.textStyle}>Sequence</Text>
        </Animated.View>

        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
          <Animated.View style={[styles.box, staggerAnimatedStyle1]}>
            <Text style={styles.textStyle}>stagger</Text>
          </Animated.View>
          <Animated.View style={[styles.box, staggerAnimatedStyle2]}>
            <Text style={styles.textStyle}>stagger</Text>
          </Animated.View>
          <Animated.View style={[styles.box, staggerAnimatedStyle3]}>
            <Text style={styles.textStyle}>stagger</Text>
          </Animated.View>
        </View>
        <Animated.View style={[styles.box, multipleAnimatedStyle]}>
          <Text style={styles.textStyle}>multiple</Text>
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
