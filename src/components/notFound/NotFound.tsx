import { Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { FC } from 'react';

interface INotFoundProps {
  text: string;
  img?: string;
}

const NotFound: FC<INotFoundProps> = (props) => {
  const { text, img } = props;
  return (
    <Stack justifyContent="center" alignItems="center" spacing={5}>
      <Image src={img ? img : '/icons/not-found/not-found.svg'} width={209} height={204} alt="not found icon" />
      <Typography variant="h6" color={'grey[500]'}>
        {text}
      </Typography>
    </Stack>
  );
};

export default NotFound;
