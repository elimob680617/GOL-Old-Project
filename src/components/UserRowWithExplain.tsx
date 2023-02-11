import { Avatar, Stack, styled, Typography } from '@mui/material';
import { FC } from 'react';

interface IUserRowWithExplainProps {
  avatar: string;
  fullname: string;
  explainText: string;
}

const FullnameStyle = styled(Typography)(({ theme }) => ({
  fontWeight: 300,
  fontSize: 14,
  lineHeight: '17.5px',
  color: theme.palette.text.primary,
}));

const ExplainStyle = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  fontSize: 12,
  lineHeight: '15px',
  color: theme.palette.text.secondary,
}));

const UserRowWithExplain: FC<IUserRowWithExplainProps> = (props) => {
  const { avatar, explainText, fullname } = props;
  return (
    <Stack sx={{ cursor: 'pointer' }} spacing={1} direction="row">
      <Avatar src={avatar} />
      <Stack spacing={0.5}>
        <FullnameStyle variant="body2">{fullname}</FullnameStyle>
        <ExplainStyle variant="caption">{explainText}</ExplainStyle>
      </Stack>
    </Stack>
  );
};

export default UserRowWithExplain;
