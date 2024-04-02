import { useEntity } from '@leanscope/ecs-engine';
import React, { useEffect } from 'react';
import { TimeFacet } from '../app/GameFacets';
import { TIME_SPEED } from '../base/constants';

const DayNightCicleSystem = () => {
  const [timeEntity] = useEntity((e) => e.has(TimeFacet));
  const time = timeEntity?.get(TimeFacet)?.props.time;

  useEffect(() => {
    if ((time || 0) >= 24) {
      timeEntity?.add(new TimeFacet({ time: 0 }));
    }
    const interval = setInterval(() => {
      timeEntity?.add(new TimeFacet({ time: (time || 0) + 0.1 }));
    }, TIME_SPEED * 100);

    return () => {
      clearInterval(interval);
    };
  }, [time]);

  return <></>;
};

export default DayNightCicleSystem;
