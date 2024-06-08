import { useEntity } from '@leanscope/ecs-engine';
import { AdditionalTags } from '../base/enums';
import { PositionFacet } from '@leanscope/ecs-models';

export const usePlayer = () => {
  const [playerEntity] = useEntity((e) => e.has(AdditionalTags.PLAYER));

  const playerPositionX = playerEntity?.get(PositionFacet)?.props.positionX || 0;
  const playerPositionY = playerEntity?.get(PositionFacet)?.props.positionY || 0;

  return { playerEntity, playerPositionX, playerPositionY };
};
