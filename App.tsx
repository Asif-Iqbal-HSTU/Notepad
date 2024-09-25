import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  Button,
  useColorScheme,
} from 'react-native';
import axios from 'axios';
import { Colors } from 'react-native/Libraries/NewAppScreen'; // Import Colors

type Thing = {
  id: number;
  name: string;
};

const App = (): React.JSX.Element => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [things, setThings] = useState<Thing[]>([]);
  const [newThing, setNewThing] = useState('');

  const fetchThings = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:8000/api/things');
      setThings(response.data);
    } catch (error) {
      console.error('Error fetching things:', error);
    }
  };

  const addThing = async () => {
    try {
      await axios.post('http://10.0.2.2:8000/api/things', {
        name: newThing,
      });
      setNewThing('');
      fetchThings();
    } catch (error) {
      console.error('Error adding thing:', error);
    }
  };

  useEffect(() => {
    fetchThings();
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <FlatList
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Things List</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter new thing"
              value={newThing}
              onChangeText={setNewThing}
            />
            <Button title="Add Thing" onPress={addThing} />
          </View>
        }
        data={things}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>{item.name}</Text>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  listContainer: {
    paddingBottom: 20,
  },
  listItem: {
    padding: 15,
    borderBottomWidth: 1,
  },
});

export default App;
