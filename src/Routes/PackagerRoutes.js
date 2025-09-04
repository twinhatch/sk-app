/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/react-in-jsx-scope */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../Screens/Provider/Home';
import NotificationPro from '../Screens/Provider/NotificationPro';
import HistoryPro from '../Screens/Provider/historypro';
import CustomTabs from '../Component/CustomTabs';
import PackagerUser from '../Screens/Provider/PackagerUser';
import Constants from '../Helpers/constant';
// import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const Tab = createBottomTabNavigator();
// const Tab = createMaterialTopTabNavigator();

const PackagerRoutes = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabs {...props} iconColor={Constants.white} />}
      screenOptions={{ tabBarHideOnKeyboard: true }}>
      <Tab.Screen name="Home" options={{ headerShown: false }} component={Home} />
      <Tab.Screen
        name="History"
        options={{ headerShown: false }}
        component={HistoryPro}
      />
      <Tab.Screen
        name="Notification"
        options={{ headerShown: false }}
        component={NotificationPro}
      />
      {/* <Tab.Screen name="Chat" component={Chat} /> */}
      <Tab.Screen
        name="Packagesuser"
        options={{ headerShown: false }}
        component={PackagerUser}
      />
    </Tab.Navigator>
    //       <Stack.Navigator>
    // <Stack.Screen name="Chat" component={Chat} />
    //      </Stack.Navigator>
  );
};

export default PackagerRoutes;
