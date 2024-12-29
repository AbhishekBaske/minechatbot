import React, { useEffect, useState } from "react";
import { StatusBar, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./config/firebase";
import Colors from "./config/colors";

// Pages Navigator
import Home from "./screens/Home";
import Menu from "./screens/Menu";
import Login from "./screens/Login";
import Register from "./screens/Register";
import Loading from "./components/Loading";
import Subscription from "./screens/Subscription";

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) return <Loading text="Fetching user data..." />;

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTitleStyle: {
            fontSize: 18,
            color: Colors.white,
          },
          headerTitleAlign: "left",
          headerTintColor: Colors.white,
        }}
      >
        {user ? (
          <>
            <Stack.Screen
              name="Home"
              component={Home}
              options={({ navigation }) => ({
                headerTitle: "Mine Bot",
                headerRight: () => (
                  <TouchableOpacity onPress={() => navigation.navigate("Menu")}>
                    <Feather
                      name="menu"
                      color={Colors.white}
                      size={22}
                      style={{ marginRight: 15 }}
                    />
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen
              name="Menu"
              component={Menu}
              options={{
                headerTitle: "More",
              }}
            />
            <Stack.Screen
              name="Subscription"
              component={Subscription}
              options={{
                headerTitle: "Subscription",
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
