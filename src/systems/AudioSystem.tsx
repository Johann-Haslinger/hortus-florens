import { useEntity } from '@leanscope/ecs-engine';
import { PositionFacet } from '@leanscope/ecs-models';
import { useEffect, useState } from 'react';
import { SoundEffectFacet } from '../app/GameFacets';
import {
  AXE_SOUND_EFFECT,
  BACKGROUND_MUSIC_2,
  HOE_SOUND_EFFECT,
  PLANT_CROP_SOUND_EFFECT,
  UI_SOUND_EFFECT_1,
  UI_SOUND_EFFECT_3,
  UI_SOUND_EFFECT_4,
  UI_SOUND_EFFECT_5,
  WATERING_CAN_SOUND_EFFECT,
} from '../assets/audio';
import { PLAYER_START_POSITION } from '../base/constants';
import { GameTags, SoundEffects } from '../base/enums';

const handleSelectSoundEffectSrc = (soundEffect: SoundEffects) => {
  switch (soundEffect) {
    case SoundEffects.AXE:
      return AXE_SOUND_EFFECT;
    case SoundEffects.HOE:
      return HOE_SOUND_EFFECT;
    case SoundEffects.WATERING_CAN:
      return WATERING_CAN_SOUND_EFFECT;
    case SoundEffects.PLANT_SEED:
      return PLANT_CROP_SOUND_EFFECT;
    case SoundEffects.ITEM_SELECT:
      return UI_SOUND_EFFECT_1;
    case SoundEffects.ITEM_COLLECT:
      return UI_SOUND_EFFECT_3;
    case SoundEffects.OPEN_INVENTORY:
      return UI_SOUND_EFFECT_4;
    case SoundEffects.CLOSE_INVENTORY:
      return UI_SOUND_EFFECT_5;

    default:
      return '';
  }
};
const AudioSystem = () => {
  const [soundEffectEntity] = useEntity((e) => e.has(SoundEffectFacet));
  const soundEffect = soundEffectEntity?.get(SoundEffectFacet)?.props.soundEffect;

  const [playerEntity] = useEntity((e) => e.hasTag(GameTags.PLAYER));
  const positionX = playerEntity?.get(PositionFacet)?.props.positionX;
  const positionY = playerEntity?.get(PositionFacet)?.props.positionY;
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (positionX !== PLAYER_START_POSITION.x || positionY !== PLAYER_START_POSITION.y) {
      const randomDelay = Math.floor(Math.random() * 1000) + 1000;
      setTimeout(() => {
        setIsPlaying(true);
      }, randomDelay);
    }
  }, [positionX, positionY]);

  useEffect(() => {
    const backgroundMusic = new Audio(BACKGROUND_MUSIC_2);
    backgroundMusic.loop = true;
    if (isPlaying) {
      backgroundMusic.play();
    } else {
      backgroundMusic.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (soundEffect) {
      const soundEffectSrc = handleSelectSoundEffectSrc(soundEffect);

      if (soundEffectSrc) {
        const soundEffectAudio = new Audio(soundEffectSrc);
        if (soundEffect === SoundEffects.CLOSE_INVENTORY) {
        }
        soundEffectAudio.play();
        soundEffectEntity.add(new SoundEffectFacet({ soundEffect: null }));
      }
    }
  }, [soundEffect]);

  return null;
};

export default AudioSystem;
