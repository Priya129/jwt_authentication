import 'package:flutter/material.dart';
import 'package:flutter_jwt_authentication_example/screens/login_screen.dart';
import 'package:flutter_jwt_authentication_example/screens/register_screen.dart';

import 'homescreen.dart';


void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Flutter Auth Demo',
      initialRoute: '/',
      routes: {
        '/': (context) => LoginScreen(),
        '/register': (context) => RegisterScreen(),
        '/home': (context) => HomeScreen(),
      },
    );
  }
}
