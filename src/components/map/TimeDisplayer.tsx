import styled from '@emotion/styled';
import { useEntity } from '@leanscope/ecs-engine';
import tw from 'twin.macro';
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
  time >= 17 && time < 18
    ? (time - 17) / 1.4
    : time >= 18 && time < 19
    ? 1 / 1.4
    : time >= 19 && time < 20
    ? 1 - (time - 19) / 1.4
    : time >= 20
    ? (time - 20) / 5
    : time > 4 && time <= 6
    ? 0.8 - (time - 4) / 2
    : time <= 4
    ? 0.8
    : 0;

const TimeDisplayer = () => {
  const [timeEntity] = useEntity((e) => e.has(TimeFacet));
  const currentTime = timeEntity?.get(TimeFacet)?.props.time || 0;
  const currentDay = timeEntity?.get(TimeFacet)?.props.day || 0;
  const timeColor = getDayTimeColor(currentTime || 0);

  return (
    <div>
      <StyledScreenOverlay color={timeColor} opcity={getDayTimeOpcity(currentTime)} />
      <StyledTimeDisplayer>
        Time: {Math.round(currentTime)}, Day: {currentDay}{' '}
      </StyledTimeDisplayer>
    </div>
  );
};

export default TimeDisplayer;
