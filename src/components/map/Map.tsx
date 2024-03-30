import React, { useState } from 'react'
import { mapData } from './mapData'
import Tile from './Tile'

const Map = () => {
  const [map, setMap] = useState<Tile[][]>(mapData)

  return (
    <div  className="map" style={{ display: 'grid', gridTemplateColumns: `repeat(${map[0].length}, 50px)` }}>
      {map.map((row, rowIndex) => (
        <React.Fragment key={rowIndex}>
          {row.map((tile, columnIndex) => (
            <Tile key={tile.id} tile={tile} />
          ))}
        </React.Fragment>
      ))}
      
    </div>
  )
}

export default Map