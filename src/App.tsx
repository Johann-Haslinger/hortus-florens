import Hotbar from './components/inventory/Hotbar';
import Inventory from './components/inventory/Inventory';
import Map from './components/map/Map';
import GameEntitiesInitializationSystem from './systems/GameEntitiesInitializationSystem';
import ItemsInitializationSystem from './systems/ItemsInitializationSystem';
import PlayerInitializationSystem from './systems/PlayerInitializationSystem';
import StoryInitializationSystem from './systems/StoryInitializationSystem';
import TilesInitializationSystem from './systems/TilesInitializationSystem';

function App() {
  return (
    <div>
      <PlayerInitializationSystem />
      <GameEntitiesInitializationSystem />
      <StoryInitializationSystem />
      <ItemsInitializationSystem />
      <TilesInitializationSystem />
      <Hotbar />
      <Inventory />
      <Map />
    </div>
  );
}

export default App;
