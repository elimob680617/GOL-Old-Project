import { Avatar, Box, Button, Stack, styled, Typography } from '@mui/material';
import { CloseCircle, UserAdd } from 'iconsax-react';
import React from 'react';

export default function ConnectinSuggestion() {
  const SuggestionCardStyle = styled(Stack)(({ theme }) => ({
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.spacing(2),
    border: '1px solid',
    borderColor: theme.palette.grey[100],
    width: 173,
    marginTop: theme.spacing(3),
  }));
  const AvatarStyle = styled(Avatar)(({ theme }) => ({
    width: 64,
    height: 64,
  }));
  return (
    <Box sx={{ width: 840, backgroundColor: ({ palette }) => palette.background.paper, borderRadius: 1 }} px={3}>
      <Stack direction="row" pt={2} justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle2" color="text.secondary">
          Suggestion
        </Typography>
        <Button variant="text" color="info" size="small">
          <Typography variant="button">See more</Typography>
        </Button>
      </Stack>
      {/* <Stack justifyContent='center' direction="row" m={3} spacing={4}> spacing={{lg:4,xs:2,md:3}}*/}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          '&>div:not(:nth-child(4n+0))': {
            marginRight: (theme) => theme.spacing(4),
          },
        }}
        pb={3}
      >
        <SuggestionCardStyle p={2}>
          <Box sx={{ position: 'relative' }}>
            <Box sx={{ position: 'absolute', left: '50px', top: '-6px' }}>
              <CloseCircle />
            </Box>
          </Box>
          <Stack spacing={2} justifyContent="center" alignItems="center">
            <AvatarStyle variant="circular">A</AvatarStyle>
            <Typography variant="subtitle2" color="text.primary">
              Franklin Weaver
            </Typography>
            <Typography variant="caption" color="text.secondary">
              This is head line of Khalid
            </Typography>
            {/* STATUS BUTTONS */}
            <Button
              variant="contained"
              color="primary"
              startIcon={<UserAdd />}
              size="small"
              sx={{ px: 2.9, py: 0.5, width: 120, height: 32 }}
            >
              <Typography variant="button">Follow</Typography>
            </Button>
            {/* <Button variant="text" size="small" sx={{px:4.1, py:0.9, backgroundColor:(theme)=>theme.palette.grey[100],width:120,height:32}}>
              <Typography variant="button" color="text.primary">
                Unfollow
              </Typography>
            </Button> */}
            {/* <Button variant="outlined" sx={{px:3.1, py:0.9, borderColor:theme=>theme.palette.grey[300],width:120,height:32}}>
              <Typography variant="button" color="text.primary" >
                Requested
              </Typography>
            </Button> */}
          </Stack>
        </SuggestionCardStyle>
        <SuggestionCardStyle p={2}>
          <Box sx={{ position: 'relative' }}>
            <Box sx={{ position: 'absolute', left: '50px', top: '-6px' }}>
              <CloseCircle />
            </Box>
          </Box>
          <Stack spacing={2} justifyContent="center" alignItems="center">
            <Avatar variant="circular" sx={{ width: 64, height: 64 }}>
              #
            </Avatar>
            <Typography variant="subtitle2" color="text.primary">
              Hashtag Name
            </Typography>
            <Typography variant="caption" color="text.secondary">
              3.4k posts
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<UserAdd />}
              size="small"
              sx={{ px: 2.9, py: 0.5, width: 120, height: 32 }}
            >
              <Typography variant="button">Follow</Typography>
            </Button>
          </Stack>
        </SuggestionCardStyle>
        <SuggestionCardStyle p={2}>
          <Box sx={{ position: 'relative' }}>
            <Box sx={{ position: 'absolute', left: '50px', top: '-6px' }}>
              <CloseCircle />
            </Box>
          </Box>
          <Stack spacing={2} justifyContent="center" alignItems="center">
            <Avatar variant="rounded" alt="Remy Sharp" sx={{ width: 64, height: 64 }} />
            <Typography variant="subtitle2" color="text.primary">
              Franklin Weaver
            </Typography>
            <Typography variant="caption" color="text.secondary">
              3.4k Followers
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<UserAdd />}
              size="small"
              sx={{ px: 2.9, py: 0.5, width: 120, height: 32 }}
            >
              <Typography variant="button">Follow</Typography>
            </Button>
          </Stack>
        </SuggestionCardStyle>
        <SuggestionCardStyle p={2}>
          <Box sx={{ position: 'relative' }}>
            <Box sx={{ position: 'absolute', left: '50px', top: '-6px' }}>
              <CloseCircle />
            </Box>
          </Box>
          <Stack spacing={2} justifyContent="center" alignItems="center">
            <Avatar variant="rounded" alt="Remy Sharp" sx={{ width: 64, height: 64 }} />
            <Typography variant="subtitle2" color="text.primary">
              Franklin Weaver
            </Typography>
            <Typography variant="caption" color="text.secondary">
              3.4k Followers
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<UserAdd />}
              size="small"
              sx={{ px: 2.9, py: 0.5, width: 120, height: 32 }}
            >
              <Typography variant="button">Follow</Typography>
            </Button>
          </Stack>
        </SuggestionCardStyle>
        <SuggestionCardStyle p={2}>
          <Box sx={{ position: 'relative' }}>
            <Box sx={{ position: 'absolute', left: '50px', top: '-6px' }}>
              <CloseCircle />
            </Box>
          </Box>
          <Stack spacing={2} justifyContent="center" alignItems="center">
            <Avatar variant="rounded" alt="Remy Sharp" sx={{ width: 64, height: 64 }} />
            <Typography variant="subtitle2" color="text.primary">
              Franklin Weaver
            </Typography>
            <Typography variant="caption" color="text.secondary">
              3.4k Followers
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<UserAdd />}
              size="small"
              sx={{ px: 2.9, py: 0.5, width: 120, height: 32 }}
            >
              <Typography variant="button">Follow</Typography>
            </Button>
          </Stack>
        </SuggestionCardStyle>
        <SuggestionCardStyle p={2}>
          <Box sx={{ position: 'relative' }}>
            <Box sx={{ position: 'absolute', left: '50px', top: '-6px' }}>
              <CloseCircle />
            </Box>
          </Box>
          <Stack spacing={2} justifyContent="center" alignItems="center">
            <Avatar variant="rounded" alt="Remy Sharp" sx={{ width: 64, height: 64 }} />
            <Typography variant="subtitle2" color="text.primary">
              Franklin Weaver
            </Typography>
            <Typography variant="caption" color="text.secondary">
              3.4k Followers
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<UserAdd />}
              size="small"
              sx={{ px: 2.9, py: 0.5, width: 120, height: 32 }}
            >
              <Typography variant="button">Follow</Typography>
            </Button>
          </Stack>
        </SuggestionCardStyle>
        <SuggestionCardStyle p={2}>
          <Box sx={{ position: 'relative' }}>
            <Box sx={{ position: 'absolute', left: '50px', top: '-6px' }}>
              <CloseCircle />
            </Box>
          </Box>
          <Stack spacing={2} justifyContent="center" alignItems="center">
            <Avatar variant="rounded" alt="Remy Sharp" sx={{ width: 64, height: 64 }} />
            <Typography variant="subtitle2" color="text.primary">
              Franklin Weaver
            </Typography>
            <Typography variant="caption" color="text.secondary">
              3.4k Followers
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<UserAdd />}
              size="small"
              sx={{ px: 2.9, py: 0.5, width: 120, height: 32 }}
            >
              <Typography variant="button">Follow</Typography>
            </Button>
          </Stack>
        </SuggestionCardStyle>
      </Box>
    </Box>
  );
}
