/* eslint-disable react-native/no-inline-styles */
// In App.js in a new project

import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, Button, Linking, Alert} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

const supportedURL = 'https://google.com';

const unsupportedURL = 'slack://channel?team=TDF3RLSG2&id=CSBQ701V0';

const OpenURLButton = ({url, children}) => {
  const handlePress = useCallback(async () => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }, [url]);

  return <Button title={children} onPress={handlePress} />;
};

function HomeScreen({navigation}) {
  const {url: initialUrl, processing} = useInitialURL();
  useEffect(() => {
    if (initialUrl) {
      const route = initialUrl.replace(/.*?:\/\//g, '');
      const routeName = route.split('/')[0];

      let query = {};
      const list = routeName.split('?')[1].split('&');
      for (let i = 0; i < list.length; i++) {
        const element = list[i].split('=');
        Object.assign(query, {
          [element[0]]: element[1],
        });
      }
      navigation.navigate(routeName, query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialUrl]);
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>
        {processing
          ? 'Processing the initial url from a deep link'
          : `The deep link is: ${initialUrl || 'None'}`}
      </Text>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details', {id: '1'})}
      />
      <OpenURLButton url={supportedURL}>Open Supported URL</OpenURLButton>
      <OpenURLButton url={unsupportedURL}>Open Unsupported URL</OpenURLButton>
    </View>
  );
}

function DetailsScreen({route}) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>
        Details Screen {route.params?.id} {route.params?.name}
      </Text>
    </View>
  );
}

function LoginScreen() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Login Screen</Text>
    </View>
  );
}

const Stack = createStackNavigator();

// eslint-disable-next-line react-hooks/exhaustive-deps
const useMount = (func) => useEffect(() => func(), []);

const useInitialURL = () => {
  const [url, setUrl] = useState(null);
  const [processing, setProcessing] = useState(true);

  useMount(() => {
    const getUrlAsync = async () => {
      // Get the deep link used to open the app
      const initialUrl = await Linking.getInitialURL();

      // The setTimeout is just for testing purpose
      setTimeout(() => {
        setUrl(initialUrl);
        setProcessing(false);
      }, 1000);
    };

    getUrlAsync();
  });

  return {url, processing};
};

function App() {
  const isLoggedIn = true;
  const linking = {
    prefixes: ['https://reytama.studio', 'deeplinkingtest://'],
    config: {
      Details: 'detail',
    },
  };
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator initialRouteName="Home">
        {isLoggedIn ? (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{headerTitleAlign: 'center'}}
            />
            <Stack.Screen name="Details" component={DetailsScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
