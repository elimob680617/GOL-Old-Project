import { Box, styled } from '@mui/material';
import { FC, PropsWithChildren } from 'react';
// import { MAXWIDTH } from 'src/config';

interface IMaxWidthProps extends PropsWithChildren {
  backgroundColor?: string;
  height?: string | number;
}

const WrapperStyle = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'filled',
})<IMaxWidthProps>(({ theme, backgroundColor, height }) => ({
  width: '100%',
  backgroundColor: backgroundColor || 'transparent',
  height: height || '',
}));

const MaxWidthStyle = styled(Box)(({ theme }) => ({
  //   maxWidth: MAXWIDTH.lg,
  maxWidth: 1128,
  width: '100%',
  minWidth: 1128,
  display: 'flex',
  margin: '0 auto',
}));

const MaxWidth: FC<IMaxWidthProps> = (props) => {
  const { children, backgroundColor, height } = props;
  return (
    <WrapperStyle backgroundColor={backgroundColor} height={height}>
      <MaxWidthStyle>{children}</MaxWidthStyle>
    </WrapperStyle>
  );
};

export default MaxWidth;
