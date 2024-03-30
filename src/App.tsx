import React from 'react';
import Map from './components/map/Map';
import ItemsInitializationSystem from './systems/ItemsInitializationSystem';
import PlayerInitializationSystem from './systems/PlayerInitializationSystem';
import TilesInitializationSystem from './systems/TilesInitializationSystem';
import Hotbar from './components/inventory/Hotbar';
import Inventory from './components/inventory/Inventory';

function App() {
  return (
    <>
      <ItemsInitializationSystem />
      <PlayerInitializationSystem />
      <TilesInitializationSystem />
      <Hotbar />
      <Inventory />
      <Map />
    </>
  );
}

export default App;
