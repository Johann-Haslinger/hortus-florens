import React from 'react';
import Map from './components/map/Map';
import ItemsInitializationSystem from './systems/ItemsInitializationSystem';
import PlayerInitializationSystem from './systems/PlayerInitializationSystem';
import TilesInitializationSystem from './systems/TilesInitializationSystem';
import Hotbar from './components/inventory/Hotbar';
import Inventory from './components/inventory/Inventory';
import StoryInitializationSystem from './systems/StoryInitializationSystem';

function App() {
  return (
    <>
      <StoryInitializationSystem />
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
