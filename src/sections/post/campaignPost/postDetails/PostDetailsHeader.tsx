// @mui
import { useTheme, Stack, Typography, Menu, MenuItem, IconButton, Dialog, Box, Divider, Button } from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
//icon
import { Icon } from 'src/components/Icon';
import { setDeletePost } from 'src/redux/slices/homePage';
import { dispatch } from 'src/redux/store';
import { useDeleteFundRaisingPostMutation } from 'src/_requests/graphql/post/campaign-post/mutations/deletePost.generated';

interface PostDetailsHeaderTypes {
  title: string;
  isMine: boolean;
  id?: string;
}

function PostDetailsHeader(props: PostDetailsHeaderTypes) {
  const { title, isMine, id } = props;
  const router = useRouter();
  const [openReportPost, setOpenReportPost] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [removePost] = useDeleteFundRaisingPostMutation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  // const handleDelete = () => {
  //   removePost({ fundRaisingPost: { dto: { id: id } } });
  //   setOpenDeleteDialog(false);
  //   router.back();
  // };

  const handleDelete = () => {
    removePost({ fundRaisingPost: { dto: { id: id } } })
      .unwrap()
      .then((res) => {
        dispatch(setDeletePost({ id: res.deleteFundRaisingPost?.listDto?.items?.[0]?.id as string, type: 'campaign' }));
      });
    setOpenDeleteDialog(false);
    router.back();
  };

  return (
    <>
      <Stack direction={'row'} sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h5">{title}</Typography>
        <IconButton
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <Icon name="Menu-1" type="solid" color="grey.500" />
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
            <MenuItem onClick={() => setOpenDeleteDialog(true)} sx={{ gap: 1, my: 2 }}>
              <Icon name="trash" type="linear" color="grey.500" />
              Delete
            </MenuItem>
            <MenuItem sx={{ gap: 1, my: 2 }}>
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
              <Icon name="Save" type="linear" color="grey.500" />
              <Typography variant="body2" color="text.primary" sx={{ ml: 2 }}>
                Save
              </Typography>
            </MenuItem>
            <MenuItem sx={{ mb: 3 }}>
              <Icon name="remove-unfollow" type="linear" color="grey.500" />
              <Typography variant="body2" color="text.primary" sx={{ ml: 2 }}>
                Unfollow
              </Typography>
            </MenuItem>
            <MenuItem sx={{ mb: 3 }}>
              <Icon name="Eye" type="linear" color="grey.500" />
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
              <Icon name="Report" type="linear" color="grey.500" />
              <Typography variant="body2" color="text.primary" sx={{ ml: 2 }}>
                Report
              </Typography>
            </MenuItem>
          </Menu>
        )}
      </Stack>
    </>
  );
}

export default PostDetailsHeader;
