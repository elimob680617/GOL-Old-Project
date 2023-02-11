import { Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { useDispatch } from 'src/redux/store';
import { signUpUserTypeDefined } from 'src/redux/slices/auth';
import { PATH_AUTH } from 'src/routes/paths';
import { UserTypeEnum } from 'src/@types/sections/serverTypes';
import Image from 'next/image';
//icons
import ArrowRight from '/public/icons/account/ArrowRight.svg';

const TypeCardStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.paper,
  transition: theme.transitions.create('background-color', { duration: theme.transitions.duration.short }),
  padding: theme.spacing(1),
  borderRadius: theme.spacing(1),
  cursor: 'pointer',
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: theme.palette.grey[100],
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
    '&>div:first-child': {
      '&>div:first-child': {
        backgroundColor: theme.palette.background.paper,
      },
    },
  },
}));
const ImageStyle = styled(Stack)(({ theme }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  width: 44,
  height: 44,
  backgroundColor: theme.palette.grey[100],
  borderRadius: 8,
}));

// ----------------------------------------------------------------------

const UserTypes = [
  { kind: UserTypeEnum.Normal, icon: '/icons/account/Group 91.svg', title: 'Normal User', body: 'Some Description ' },
  { kind: UserTypeEnum.Ngo, icon: '/icons/account/Path 333.svg', title: 'NGO', body: 'Some Description' },
  { kind: UserTypeEnum.Company, icon: '/icons/account/Vector.svg', title: 'Company', body: 'Some Description' },
];

export default function UserTypeSelection() {
  const router = useRouter();
  const dispatch = useDispatch();

  const selectType = (type: UserTypeEnum) => () => {
    dispatch(signUpUserTypeDefined({ userType: type }));
    router.push(PATH_AUTH.signUp.basicInfo);
  };

  return (
    <Stack sx={{ mt: 3 }} spacing={3}>
      {UserTypes.map((type) => (
        <TypeCardStyle key={type.title} onClick={selectType(type.kind)}>
          <Stack direction="row" alignItems="center">
            <ImageStyle>
              <Image src={type.icon} width={17} height={17} alt={type.title} />
            </ImageStyle>
            <Stack pl={2} spacing={0.5}>
              <Typography variant="subtitle2" color="primary.dark">
                {type.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {type.body}
              </Typography>
            </Stack>
          </Stack>
          <Stack>
            <Image src={ArrowRight} alt="right" />
          </Stack>
        </TypeCardStyle>
      ))}
    </Stack>
  );
}
