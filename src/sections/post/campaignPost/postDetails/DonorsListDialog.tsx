// @mui
import { Circle } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  styled,
  Typography,
  useTheme,
} from '@mui/material';
import Image from 'next/image';
import { useEffect } from 'react';
import { DonorType } from 'src/@types/sections/serverTypes';
import { useLazyGetDonorsQueryQuery } from 'src/_requests/graphql/post/post-details/queries/getDonorsQuery.generated';

const ExplainStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));
const HeaderWrapperStyle = styled(Stack)(({ theme }) => ({
  height: 56,
  padding: theme.spacing(2, 1.5, 2, 2),
  boxShadow: '0px 0px 1px rgba(40, 41, 61, 0.04), 0px 2px 4px rgba(96, 97, 112, 0.16)',
}));
const PostTitleDot = styled('span')(({ theme }) => ({
  color: theme.palette.grey[300],
  fontSize: '5px',
  margin: '0 0.5rem',
  display: 'flex',
  alignItems: 'center',
}));

interface DonorListProps {
  PostId: string;
  donors?: DonorType[];
  open: boolean;
  onClose: () => void;
}
function DonorsListDialog(props: DonorListProps) {
  const { donors, open, onClose, PostId } = props;
  const theme = useTheme();
  const [getDonorsQuery, { data: getDonorsData }] = useLazyGetDonorsQueryQuery();

  useEffect(() => {
    if (PostId)
      getDonorsQuery({
        filter: {
          dto: {
            campaignId: PostId,
          },
        },
      });
  }, [PostId]);

  console.log('PostId', PostId);

  return (
    <>
      <Dialog fullWidth open={open} aria-labelledby="responsive-dialog-title">
        <DialogTitle sx={{ padding: 0 }} id="responsive-dialog-title">
          <HeaderWrapperStyle direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle1" color={theme.palette.text.primary}>
              Donors list
            </Typography>
            <IconButton onClick={onClose} sx={{ padding: 0 }}>
              <Image src="/icons/Close/24/Outline.svg" width={24} height={24} alt="close" />
            </IconButton>
          </HeaderWrapperStyle>
        </DialogTitle>
        <DialogContent sx={{ padding: 2 }}>
          {!!donors?.length ? (
            <Stack spacing={3} sx={{ marginTop: 3 }}>
              {donors?.map((item, index) => (
                <Stack
                  key={(item?.fullName || '') + index}
                  sx={{ cursor: 'pointer', alignItems: 'center' }}
                  spacing={2}
                  direction="row"
                >
                  <Avatar
                    src={item?.avatarUrl || undefined}
                    sx={{ width: 48, height: 48 }}
                    alt={item?.fullName || ''}
                  />
                  <Stack spacing={0.5}>
                    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                      <Typography variant="subtitle1" color={theme.palette.text.primary}>
                        {item?.fullName
                          ? item?.fullName
                          : item?.firstName || item?.lastName
                          ? `${item?.firstName} ${item?.lastName}`
                          : ' '}
                      </Typography>
                      <PostTitleDot>
                        <Circle fontSize="inherit" />
                      </PostTitleDot>
                      <Typography variant="caption" color={theme.palette.text.secondary}>
                        {/* {item?.donateDate} */}
                      </Typography>
                    </Stack>

                    <ExplainStyle variant="body2">
                      {item?.isMyConnection
                        ? 'Your connection'
                        : item?.mutualConnections
                        ? `${item?.mutualConnections} mutual connections`
                        : item?.isAnonymous
                        ? ''
                        : ''}
                    </ExplainStyle>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          ) : (
            <Stack sx={{ justifyContent: 'center', alignItems: 'center', m: 8 }} spacing={2}>
              <Box>
                <Image src="/icons/EmptyDialog.svg" width={227} height={227} alt="empty-dialog" />
              </Box>

              <Typography variant="h6" color={theme.palette.text.primary}>
                There is no Donor here
              </Typography>
            </Stack>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default DonorsListDialog;
