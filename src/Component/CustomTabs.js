/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Constants from '../Helpers/constant';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ChatIcon, HistoryIcon, HomeIcon, NotiIcon, UserIcon } from './icons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Context } from '../../App';

const width = Dimensions.get('screen').width;

const CustomTabs = ({ state, descriptors, navigation, iconColor }) => {
  // console.log('sdaddasdsdsadd=========>', state);
  const [newIndex, setNewIndex] = useState(state.index);
  const [selectedRoute, setSelectedRoute] = useState('Home');
  const [initial, setInitial] = useContext(Context);

  const animate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setNewIndex(state.index);
    setSelectedRoute(state.routeNames[state.index]);
  }, [state]);

  useEffect(() => {
    console.log(initial);
    console.log('Constat ===============>', Constants[initial], iconColor);
  }, [initial]);

  useEffect(() => {
    startAnimation();
  }, [newIndex]);

  const startAnimation = () => {
    Animated.timing(animate, {
      toValue: (width / 4) * newIndex,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const LoadImage = name => {
    // console.log(name);
    switch (name) {
      case 'Home':
        return HomeIcon(iconColor, 25, 25);
      case 'History':
        return HistoryIcon(iconColor, 25, 25);
      case 'Notification':
        return NotiIcon(iconColor, 25, 25);
      case 'Traveluser':
        return <FontAwesome name="handshake-o" size={25} color={iconColor} />;
      case 'Packagesuser':
        return <FontAwesome name="handshake-o" size={25} color={iconColor} />;
      // UserIcon(iconColor, 25, 25);
    }
  };
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          backgroundColor: Constants[initial],
          height: 64,
          position: 'relative',
        },
      ]}>
      <Animated.View
        style={[
          { position: 'absolute', left: 0, top: -8, height: 64 },
          {
            transform: [{ translateX: animate }],
          },
        ]}>
        <View
          style={{
            position: 'relative',
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Image
            style={{ width: width / 4, objectFit: 'contain' }}
            source={require('../Assets/newImgs/curvePoint.png')}
          />
          <View
            style={{
              position: 'absolute',
              height: (width / 4 / 100) * 70,
              width: (width / 4 / 100) * 70,
              borderRadius: (width / 4 / 100) * 70,
              backgroundColor: Constants[initial],
              right: (width / 4 / 100) * 15,
              bottom: 10,
              justifyContent: 'center',
              alignItems: 'center',
              borderColor: Constants.white,
              borderWidth: 5,
              boxWithShadow: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.8,
                shadowRadius: 2,
                elevation: 5,
              },
            }}>
            {LoadImage(selectedRoute)}
          </View>
        </View>
      </Animated.View>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          setNewIndex(index);
          console.log(route.name);
          setTimeout(() => {
            setSelectedRoute(route.name);
          }, 250);
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({ name: route.name, merge: true });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {newIndex !== index && LoadImage(route.name)}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CustomTabs;
