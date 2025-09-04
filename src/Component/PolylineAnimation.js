/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react';
import { Polyline } from 'react-native-maps';
import Animated, { Easing, useSharedValue, withTiming, useAnimatedProps } from 'react-native-reanimated';

const AnimatedPolyline = ({ coordinates }) => {
    const progress = useSharedValue(0);
    const pathLength = coordinates.length;

    const animatedProps = useAnimatedProps(() => {
        const animatedCoordinates = coordinates.slice(0, Math.floor(progress.value * pathLength));
        return { coordinates: animatedCoordinates };
    });

    useEffect(() => {
        progress.value = withTiming(1, {
            duration: 3000,
            easing: Easing.linear,
        });
    }, []);

    return <AnimatedPolylineComponent animatedProps={animatedProps} />;
};

const AnimatedPolylineComponent = Animated.createAnimatedComponent(Polyline);

export default AnimatedPolyline;
