import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SearchScreen from '../screens/SearchScreen';
import HistoryDrawerContent from '../components/HistoryDrawerContent';
import { useSearchContext } from '../context/SearchContext';

export type DrawerParamList = {
  Search: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

const DrawerNavigator: React.FC = () => {
  const { isSearching, searchFromHistory } = useSearchContext();

  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <HistoryDrawerContent
          {...props}
          onSelectWord={searchFromHistory}
          isSearching={isSearching}
        />
      )}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FFFFFF',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#E2E8F0',
        },
        headerTitleStyle: {
          fontWeight: '600',
          color: '#1A202C',
        },
        drawerStyle: {
          width: 280,
        },
        drawerType: 'front',
      }}
    >
      <Drawer.Screen
        name="Search"
        component={SearchScreen}
        options={{
          title: 'Dictionary',
          headerTitle: 'Dictionary',
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
