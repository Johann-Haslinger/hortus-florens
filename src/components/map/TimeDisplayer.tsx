import React from 'react';
import tw from 'twin.macro';
import styled from '@emotion/styled';
import { useEntity } from '@leanscope/ecs-engine';
import { TimeFacet } from '../../app/GameFacets';

enum DAY_TIME_COLORS {
  EVENING = '#ff6a0069',
  NIGHT = '#050022',
}

const StyledScreenOverlay = styled.div<{ color: string; opcity: number }>`
  ${tw`fixed z-[100] duration-1000  top-0 left-0  w-screen h-screen transition-all`}
  background-color: ${({ color }) => color};
  opacity: ${({ opcity }) => opcity};
`;
const StyledTimeDisplayer = styled.div`
  ${tw`fixed z-[300] text-white bg-black bg-opacity-80 top-0 left-0 p-4`}
`;

const getDayTimeColor = (time: number) => {
  if (time >= 17 && time <= 20) {
    return DAY_TIME_COLORS.EVENING;
  } else if (time > 20 || time < 6) {
    return DAY_TIME_COLORS.NIGHT;
  } else {
    return '';
  }
};

const getDayTimeOpcity = (time: number) =>
time >=  17 && time < 18 ? (time - 17 )/ 1.4 : time >= 18  && time < 19 ? 1 / 1.4 : time >= 19 && time < 20 ? 1 - ((time -19 )/ 1.4)  :  time >= 20 ? (time - 20) / 5 : time > 4 && time <= 6 ? 0.8 - (time - 4) / 2 : time <= 4 ? 0.8 : 0;

const TimeDisplayer = () => {
  const [timeEntity] = useEntity((e) => e.has(TimeFacet));
  const time = timeEntity?.get(TimeFacet)?.props.time || 0;
  const timeColor = getDayTimeColor(time || 0);

  return (
    <>
      <StyledScreenOverlay color={timeColor} opcity={getDayTimeOpcity(time)} />
      <StyledTimeDisplayer>Time: {Math.round(time)}</StyledTimeDisplayer>
    </>
  );
};

export default TimeDisplayer;
