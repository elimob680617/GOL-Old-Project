import { MoreHoriz } from '@mui/icons-material';
import { Box, IconButton, Menu, MenuItem, Stack, Typography, Button, Divider, Dialog } from '@mui/material';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import Link from 'next/link';
import reportIcon from 'public/icons/flag/24/Outline.svg';
import saveIcon from 'public/icons/save.png';
import unfollow from 'public/icons/unfollow.png';
import eyeIcon from 'public/icons/user-interface/Eye.png';
import { FC, ReactNode, useEffect, useMemo, useState } from 'react';
import { ConnectionStatusEnum, UserTypeEnum } from 'src/@types/sections/serverTypes';
import { PATH_APP } from 'src/routes/paths';
import { useDeleteFundRaisingPostMutation } from 'src/_requests/graphql/post/campaign-post/mutations/deletePost.generated';
import { useLazyGetUserDetailQuery } from 'src/_requests/graphql/profile/publicDetails/queries/getUser.generated';
import { ReportParentDialog } from '../reportPostAndProfile';
//icon
import { Icon } from 'src/components/Icon';
import { dispatch } from 'src/redux/store';
import { setDeletePost, setUpdatePost } from 'src/redux/slices/homePage';
interface IPostTitle {
  avatar: ReactNode;
  username: string;
  Date: string;
  PostNo: string;
  description?: string;
  editCallback?: () => void;
  location?: string;
  userId: string;
  userType: UserTypeEnum;
  isMine: boolean;
  postId: string;
  setIsReport?: any;
}

const PostTitleDot = styled('span')(({ theme }) => ({
  color: theme.palette.grey[300],
  margin: 1,
}));

const SelectedLocationStyle = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  fontSize: '14px',
  lineHeight: '17.5px',
  color: theme.palette.text.secondary,
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 1,
  WebkitBoxOrient: 'vertical',
  cursor: 'pointer',
}));
const PostTitle: FC<IPostTitle> = ({
  setIsReport,
  avatar,
  username,
  Date,
  PostNo,
  description,
  editCallback,
  location,
  isMine,
  userId,
  userType,
  postId,
}: IPostTitle) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [removePost] = useDeleteFundRaisingPostMutation();
  const [GetUserDetailQuery, { data: getUserData }] = useLazyGetUserDetailQuery();
  const getUser = getUserData?.getUser?.listDto?.items?.[0]?.connectionDto;
  const [openReportPost, setOpenReportPost] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const edit = () => {
    if (editCallback) {
      handleClose();
      editCallback();
    }
  };
  const handleDelete = () => {
    removePost({ fundRaisingPost: { dto: { id: postId } } })
      .unwrap()
      .then((res) => {
        dispatch(setDeletePost({ id: res.deleteFundRaisingPost?.listDto?.items?.[0]?.id as string, type: 'campaign' }));
      });
    setOpenDeleteDialog(false);
  };

  const profileRoute = useMemo(() => {
    if (userType === UserTypeEnum.Ngo) {
      if (isMine) return PATH_APP.profile.ngo.root;
      return PATH_APP.profile.ngo.root + '/view/' + userId;
    } else {
      if (isMine) return PATH_APP.profile.user.root;
      return PATH_APP.profile.user.root + '/view/' + userId;
    }
  }, [isMine, userId, userType]);

  useEffect(() => {
    GetUserDetailQuery({ filter: { dto: { id: userId } } });
  }, []);
  return (
    <>
      <Stack
        sx={{ paddingRight: 2, paddingLeft: 2 }}
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Stack direction="row" spacing={2}>
          <Link href={profileRoute} passHref>
            <Box sx={{ cursor: 'pointer' }}>{avatar}</Box>
          </Link>
          <Stack spacing={1}>
            <Stack spacing={1} direction="row" sx={{ display: 'flex', alignItems: 'center' }}>
              <Link href={profileRoute} passHref>
                <Typography variant="h6" sx={{ cursor: 'pointer' }}>
                  {username}
                </Typography>
              </Link>
              {location && (
                <Stack justifyContent="center">
                  <img src="/icons/dot.svg" width={5} height={5} alt="selected-location" />
                </Stack>
              )}
              {location && (
                <Stack sx={{ flex: 1 }} spacing={0.5} direction="row" alignItems="center" flexWrap="nowrap">
                  <Box>
                    <img src="/icons/location/24/Outline.svg" width={20} height={20} alt="selected-location" />
                  </Box>
                  <SelectedLocationStyle>
                    <Typography variant="subtitle2" color="text.secondary">
                      {location}
                    </Typography>
                  </SelectedLocationStyle>
                </Stack>
              )}
            </Stack>
            <Stack alignItems="center" direction="row" spacing={1}>
              <Typography variant="body2" color="text.secondary">
                {Date}
              </Typography>
              <PostTitleDot>
                <Stack justifyContent="center">
                  <img src="/icons/dot.svg" width={5} height={5} alt="selected-location" />
                </Stack>
              </PostTitleDot>

              {PostNo === 'simple' ? (
                <Stack justifyContent="center">
                  <img src="/icons/Earth/24/Outline.svg" width={20} height={20} alt="selected-location" />
                </Stack>
              ) : (
                'sc'
              )}
            </Stack>
          </Stack>
        </Stack>
        <Stack justifyContent="flex-start">
          <IconButton
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            <MoreHoriz sx={{ color: '#8798A1' }} />
          </IconButton>

          {isMine ? (
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
              PaperProps={{
                style: {
                  width: '200px',
                },
              }}
            >
              <MenuItem onClick={() => setOpenDeleteDialog(true)} sx={{ gap: 1, my: 1 }}>
                <Icon name="trash" type="linear" color="grey.500" />
                Delete
              </MenuItem>
              <MenuItem onClick={() => edit()} sx={{ gap: 1, my: 1 }}>
                <Icon name="Edit-Pen" type="linear" color="grey.500" />
                Edit
              </MenuItem>
              <Dialog maxWidth="sm" fullWidth onClose={() => setOpenDeleteDialog(false)} open={openDeleteDialog}>
                <Stack spacing={2} sx={{ py: 2 }}>
                  <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="subtitle1" color="text.primary">
                        Do you want to delete this post?
                      </Typography>
                    </Box>

                    <IconButton onClick={() => setOpenDeleteDialog(false)}>
                      <Icon name="Close-1" type="linear" color="grey.700" />
                    </IconButton>
                  </Stack>
                  <Divider />
                  <Stack spacing={1} sx={{ px: 2 }}>
                    <Box
                      sx={{ display: 'flex', cursor: 'pointer', alignItems: 'center' }}
                      onClick={() => {
                        setOpenDeleteDialog(false);
                      }}
                    >
                      <Button onClick={handleDelete} sx={{ p: 0 }}>
                        <Icon name="trash" type="linear" color="error.main" />
                        <Typography variant="body2" color="error.main" sx={{ ml: 1 }}>
                          Delete
                        </Typography>
                      </Button>
                    </Box>
                    <Box sx={{ display: 'flex', cursor: 'pointer', alignItems: 'center' }}>
                      <Button onClick={() => setOpenDeleteDialog(false)} sx={{ p: 0 }}>
                        <Icon name="Close-1" type="linear" color="grey.700" />
                        <Typography variant="body2" color="text.primary" sx={{ ml: 1 }}>
                          Discard
                        </Typography>
                      </Button>
                    </Box>
                  </Stack>
                </Stack>
              </Dialog>
            </Menu>
          ) : (
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
              sx={{ p: 2 }}
            >
              <MenuItem sx={{ mb: 3 }}>
                ‌<Image src={saveIcon} alt="saveIcon" />
                <Typography variant="body2" color="text.primary" sx={{ ml: 2 }}>
                  Save
                </Typography>
              </MenuItem>
              <MenuItem sx={{ mb: 3 }}>
                <Image src={unfollow} alt="unfollow" />
                <Typography variant="body2" color="text.primary" sx={{ ml: 2 }}>
                  Unfollow
                </Typography>
              </MenuItem>
              <MenuItem sx={{ mb: 3 }}>
                <Image src={eyeIcon} alt="eyeIcon" />
                <Typography variant="body2" color="text.primary" sx={{ ml: 2 }}>
                  I don't want to see this post
                </Typography>
              </MenuItem>
              <MenuItem
                sx={{ mb: 2 }}
                onClick={() => {
                  setOpenReportPost(true);
                  setAnchorEl(null);
                }}
              >
                <Image src={reportIcon} width={24} alt="reportIcon" />
                <Typography variant="body2" color="text.primary" sx={{ ml: 2 }}>
                  Report
                </Typography>
              </MenuItem>
            </Menu>
          )}
        </Stack>
      </Stack>
      {openReportPost && (
        <ReportParentDialog
          setIsReport={setIsReport}
          setOpenDialog={setOpenReportPost}
          reportType="post"
          postId={postId}
          userId={userId}
          fullName={username}
          openDialog={openReportPost}
          isBlocked={getUser?.meBlockedOther as boolean}
          isFollowing={getUser?.meToOtherStatus === ConnectionStatusEnum.Accepted}
        />
      )}
    </>
  );
};

export default PostTitle;
