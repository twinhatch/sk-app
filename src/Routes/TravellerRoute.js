/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unstable-nested-components */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import CustomTabs from '../Component/CustomTabs';
import Home from '../Screens/Traveller/Home';
import History from '../Screens/Traveller/History';
import Notification from '../Screens/Traveller/Notification';
import TravelUser from '../Screens/Traveller/TravelUser';
import Constants from '../Helpers/constant';

const Tab = createBottomTabNavigator();
// const Tab = createMaterialTopTabNavigator();

const TravellerRoute = () => {
  return (
    <Tab.Navigator
      screenOptions={{ swipeEnabled: true }}
      // tabBarPosition="bottom"
      tabBar={props => <CustomTabs {...props} iconColor={Constants.black} />}>
      <Tab.Screen name="Home" options={{ headerShown: false }} component={Home} />
      <Tab.Screen
        name="History"
        options={{ headerShown: false }}
        component={History}
      />
      <Tab.Screen
        name="Notification"
        options={{ headerShown: false }}
        component={Notification}
      />
      {/* <Tab.Screen name="Chat" component={ChatStack} /> */}
      <Tab.Screen
        name="Traveluser"
        options={{ headerShown: false }}
        component={TravelUser}
      />
    </Tab.Navigator>
  );
};

export default TravellerRoute;
