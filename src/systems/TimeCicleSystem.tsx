import { useEntity } from '@leanscope/ecs-engine';
import { useEffect } from 'react';
import { TimeFacet } from '../app/GameFacets';
import { TIME_SPEED } from '../base/constants';

const TimeCicleSystem = () => {
  const [timeEntity] = useEntity((e) => e.has(TimeFacet));
  const time = timeEntity?.get(TimeFacet)?.props.time;

  useEffect(() => {
    if ((time || 0) >= 24) {
      timeEntity?.add(new TimeFacet({ time: 0, day: (timeEntity?.get(TimeFacet)?.props.day || 0) + 1 }));
    }
    const interval = setInterval(() => {
      timeEntity?.add(new TimeFacet({ time: (time || 0) + 0.1, day: timeEntity?.get(TimeFacet)?.props.day || 0 }));
    }, TIME_SPEED * 100);

    return () => {
      clearInterval(interval);
    };
  }, [time]);

  return null;
};

export default TimeCicleSystem;
