import { FC, useState, useEffect } from 'react';
import {
  Badge,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { FilterByEnum } from 'src/@types/sections/serverTypes';
import useConnection from 'src/hooks/useConnection';
import { useDispatch } from 'src/redux/store';
import { onResetConnections } from 'src/redux/slices/connection/connections';

// const StyledBadge = styled(Badge)(({ theme }) => ({
//     '& .MuiBadge-badge': {
//       backgroundColor: theme.palette.error,
//       color: theme.palette.error,
//       boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
//       '&::after': {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         width: '100%',
//         height: '100%',
//         borderRadius: '50%',
//         animation: 'ripple 1.2s infinite ease-in-out',
//         border: '1px solid currentColor',
//         content: '""',
//       },
//     },
//     '@keyframes ripple': {
//       '0%': {
//         transform: 'scale(.8)',
//         opacity: 1,
//       },
//       '100%': {
//         transform: 'scale(2.4)',
//         opacity: 0,
//       },
//     },
//   }));
const ConnectionSidebarStyled = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: 8,
  maxWidth: 264,
}));
const ConnectionSidebar: FC<{ pageIndex: number; setPageIndex: React.Dispatch<React.SetStateAction<number>> }> = ({
  pageIndex,
  setPageIndex,
}) => {
  const {
    query: { type, userId },
  } = useRouter();
  const dispatch = useDispatch();

  const [filterBy, setFilterBy] = useState<FilterByEnum>(FilterByEnum.All);
  const [searchText, setSearchText] = useState<string>('');
  const [debounced, setDebounced] = useState<string>('');
  useConnection(type! as string, pageIndex, debounced, filterBy, userId);

  useEffect(() => {
    const searchDelay = setTimeout(() => {
      setDebounced(searchText);
      dispatch(onResetConnections());
      setPageIndex(1);
    }, 500);

    return () => clearTimeout(searchDelay);
  }, [searchText, setPageIndex]);
  return (
    <>
      <ConnectionSidebarStyled p={2} spacing={3}>
        <Stack direction="row">
          <Badge color="error" variant="dot" invisible={filterBy === FilterByEnum.All}>
            <Typography variant="subtitle1" color="text.primary" pr={1}>
              Filter by
            </Typography>
          </Badge>
        </Stack>
        <Stack spacing={2}>
          <TextField
            id="searchBox"
            name="searchBox"
            variant="outlined"
            size="small"
            // {...(getInputProps() as JSX.Element)}
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{
              startAdornment: (
                <img
                  src="/icons/Research/Outline.svg"
                  width={20}
                  height={20}
                  alt="research"
                  style={{ marginRight: 8 }}
                />
              ),
            }}
          />
          {/* <RHFTextField name="Followers" placeholder="Followers" /> */}
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              defaultValue="All"
              // value={values}
              onChange={(e) => {
                setFilterBy(e.target.value as FilterByEnum);
                dispatch(onResetConnections());
                setPageIndex(1);
              }}
            >
              <FormControlLabel
                value={'ALL' as FilterByEnum}
                checked={filterBy === 'ALL'}
                control={<Radio />}
                label={<Typography variant="body2">All</Typography>}
              />
              {type === 'followings' && (
                <FormControlLabel
                  value={'HASHTAG' as FilterByEnum}
                  checked={filterBy === 'HASHTAG'}
                  control={<Radio />}
                  label={<Typography variant="body2">Hashtags</Typography>}
                />
              )}
              {type !== 'requested' && (
                <FormControlLabel
                  value={'NGO' as FilterByEnum}
                  control={<Radio />}
                  checked={filterBy === 'NGO'}
                  label={<Typography variant="body2">NGO</Typography>}
                />
              )}
              <FormControlLabel
                value={'NORMAL' as FilterByEnum}
                control={<Radio />}
                checked={filterBy === 'NORMAL'}
                label={<Typography variant="body2">Normal User</Typography>}
              />
            </RadioGroup>
          </FormControl>
        </Stack>
      </ConnectionSidebarStyled>
    </>
  );
};

export default ConnectionSidebar;
