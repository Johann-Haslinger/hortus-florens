import React, { useEffect, useRef, useState } from 'react';
import {
  AXE_SOUND_EFFECT,
  BACKGROUND_MUSIC_1,
  BACKGROUND_MUSIC_2,
  HOE_SOUND_EFFECT,
  PLANT_CROP_SOUND_EFFECT,
  UI_SOUND_EFFECT_1,
  UI_SOUND_EFFECT_2,
  UI_SOUND_EFFECT_3,
  UI_SOUND_EFFECT_4,
  UI_SOUND_EFFECT_5,
  WATERING_CAN_SOUND_EFFECT,
} from '../audio';
import { useEntity } from '@leanscope/ecs-engine';
import { GAME_TAGS, SOUND_EFFECTS } from '../base/enums';
import { PositionFacet } from '@leanscope/ecs-models';
import { PLAYER_START_POSITION } from '../base/constants';
import { SoundEffectFacet } from '../app/GameFacets';

const handleSelectSoundEffectSrc = (soundEffect: SOUND_EFFECTS) => {
  switch (soundEffect) {
    case SOUND_EFFECTS.AXE:
      return AXE_SOUND_EFFECT;
    case SOUND_EFFECTS.HOE:
      return HOE_SOUND_EFFECT;
    case SOUND_EFFECTS.WATERING_CAN:
      return WATERING_CAN_SOUND_EFFECT;
    case SOUND_EFFECTS.PLANT_SEED:
      return PLANT_CROP_SOUND_EFFECT;
    case SOUND_EFFECTS.ITEM_SELECT:
      return UI_SOUND_EFFECT_1;
    case SOUND_EFFECTS.ITEM_COLLECT:
      return UI_SOUND_EFFECT_3;
    case SOUND_EFFECTS.OPEN_INVENTORY:
      return UI_SOUND_EFFECT_4;
    case SOUND_EFFECTS.CLOSE_INVENTORY:
      return UI_SOUND_EFFECT_5;

    default:
      return '';
  }
};
const AudioSystem = () => {
  const [soundEffectEntity] = useEntity((e) => e.has(SoundEffectFacet));
  const soundEffect = soundEffectEntity?.get(SoundEffectFacet)?.props.soundEffect;

  const [playerEntity] = useEntity((e) => e.hasTag(GAME_TAGS.PLAYER));
  const positionX = playerEntity?.get(PositionFacet)?.props.positionX;
  const positionY = playerEntity?.get(PositionFacet)?.props.positionY;
  const [isPlaying, setIsPlaying] = useState(false);
  const randomNum = Math.floor(Math.random() * 2) + 1;

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
        if (soundEffect === SOUND_EFFECTS.CLOSE_INVENTORY) {
         
        }
        soundEffectAudio.play();
        soundEffectEntity.add(new SoundEffectFacet({ soundEffect: null }));
      }
    }
  }, [soundEffect]);

  return <></>;
};

export default AudioSystem;
