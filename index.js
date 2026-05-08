/**
 * @format
 */

import '@react-native-firebase/app';
import '@react-native-firebase/firestore';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
