import styled from '@emotion/styled';
import tw from 'twin.macro';

const StyledTile = styled.div<{ type: string; y: number; x: number }>`
  ${({ type }) => (type === 'grass' ? tw`bg-green-500` : tw` bg-[#4f3a2b]`)}
  width: 50px;
  height: 50px;
  border: 1px solid black;
  display: inline-block;
  grid-row: ${(props) => props.y + 1};
  grid-column: ${(props) => props.x + 1};
`;

const Tile = (props: { tile: Tile }) => {
  const {
    tile: { type, x, y },
  } = props;
  return <StyledTile type={type} x={x} y={y} />;
};

export default Tile;
