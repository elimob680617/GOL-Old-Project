import { FormControl, InputLabel, MenuItem, Radio, Select, SelectChangeEvent, Stack, Typography } from '@mui/material';

import { FC, useEffect, useState } from 'react';

import { Icon } from 'src/components/Icon';

import useCampgingCategories from 'src/hooks/useCampginCategories';

const SelectByCategory: FC<{ selectedCategory: number; categorySelected: (category: number) => void }> = ({
  categorySelected,

  selectedCategory,
}) => {
  const [value, setValue] = useState<number>(selectedCategory);

  const categories = useCampgingCategories();

  const handleSelectChange = (event: SelectChangeEvent) => {
    setValue(+event.target.value);

    categorySelected(+event.target.value);
  };

  useEffect(() => {
    setValue(selectedCategory);
  }, [selectedCategory]);

  return (
    <Stack spacing={3}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Icon name="Info" color="text.secondary" />

        <Typography variant="caption" color="text.secondary">
          Filttering Campaign post based on categories
        </Typography>
      </Stack>

      <FormControl size="small">
        <InputLabel>Categories</InputLabel>

        <Select
          renderValue={(value) =>
            (categories?.getCampaignCategoriesQuery.listDto?.items &&
              categories?.getCampaignCategoriesQuery.listDto?.items.find((i) => i!.id!.toString() == value)?.title) ||
            'All'
          }
          value={selectedCategory.toString()}
          label="Categories"
          onChange={handleSelectChange}
        >
          <MenuItem value={0}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Radio readOnly checked={!value} />

              <Typography variant="body2" color="text.primary">
                All
              </Typography>
            </Stack>
          </MenuItem>

          {categories?.getCampaignCategoriesQuery.listDto?.items &&
            categories?.getCampaignCategoriesQuery.listDto?.items.map((category) => (
              <MenuItem key={category!.title!} value={category!.id!}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Radio readOnly checked={value == category!.id!} />

                  <Typography variant="body2" color="text.primary">
                    {category?.title}
                  </Typography>
                </Stack>
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </Stack>
  );
};

export default SelectByCategory;

// import * as React from 'react';

// import { styled } from '@mui/material/styles';

// import Popper from '@mui/material/Popper';

// import ClickAwayListener from '@mui/material/ClickAwayListener';

// import Box from '@mui/material/Box';

// import {

//   debounce,

//   Divider,

//   FormControlLabel,

//   InputAdornment,

//   Radio,

//   RadioGroup,

//   Stack,

//   Typography,

// } from '@mui/material';

// import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';

// import { categories } from '../careateCampaignPost/CreateCampaignPost';

// import Image from 'next/image';

// import { Icon } from 'src/components/Icon';

// const StyledPopper = styled(Popper)(({ theme }) => ({

//   borderRadius: theme.spacing(2),

//   zIndex: theme.zIndex.modal,

//   backgroundColor: theme.palette.common.white,

//   border: `2px solid ${theme.palette.grey[100]}`,

// }));

// const DividerStyle = styled(Divider)(({ theme }) => ({

//   borderBottom: `2px solid ${theme.palette.grey[100]}`,

// }));

// const SelectStyle = styled(Stack)(({ theme }) => ({

//   borderRadius: theme.spacing(1),

//   border: `1px solid ${theme.palette.grey[300]}`,

//   padding: theme.spacing(1, 2),

//   cursor: 'pointer',

// }));

// const SelectByCategory: FC<{ selectedCategory: string; categorySelected: (category: string) => void }> = ({

//   categorySelected,

//   selectedCategory,

// }) => {

//   const [value, setValue] = useState<string>('');

//   const handleChange = (event: ChangeEvent<HTMLInputElement>) => {

//     categorySelected(event.target.value);

//   };

//   const wrapperRef = useRef<HTMLElement>(null);

//   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

//   const [searchedText, setSearchedText] = useState<string>('');

//   const handleClose = () => {

//     setAnchorEl(null);

//   };

//   const open = Boolean(anchorEl);

//   const id = open ? 'github-label' : undefined;

//   const handleFocus = (event: React.MouseEvent<HTMLElement>) => {

//     setAnchorEl(event.currentTarget);

//   };

//   useEffect(() => {

//     categorySelected(value);

//   }, [value]);

//   return (

//     <Stack spacing={3}>

//       <Stack direction="row" alignItems="center" spacing={1}>

//         <Icon name="Info" color="text.secondary" />

//         <Typography variant="caption" color="text.secondary">

//           Filttering Campaign post based on categories

//         </Typography>

//       </Stack>

//       <ClickAwayListener onClickAway={handleClose}>

//         <Stack

//           sx={{

//             ...(!!anchorEl && {

//               bgcolor: 'common.white',

//               border: (theme) => `1px solid ${theme.palette.grey[300]}`,

//             }),

//           }}

//           spacing={3}

//         >

//           <SelectStyle direction="row" alignItems="center" justifyContent="space-between" onClick={handleFocus}>

//             <Typography variant="body2" color="text.secondary">

//               Categories

//             </Typography>

//             <Icon name="down-arrow" />

//           </SelectStyle>

//           <Box ref={wrapperRef}>

//             <StyledPopper

//               sx={{ width: wrapperRef.current?.clientWidth }}

//               id={id}

//               open={open}

//               anchorEl={anchorEl}

//               placement="bottom-start"

//             >

//               <RadioGroup value={value} onChange={handleChange}>

//                 <Stack spacing={2}>

//                   {categories.map((category) => (

//                     <Stack key={category.title} direction="row" spacing={2} sx={{ alignItems: 'center' }}>

//                       <Radio value={category.value} />

//                       <Typography variant="body2" color="text.primary">

//                         {category.title}

//                       </Typography>

//                     </Stack>

//                   ))}

//                 </Stack>

//               </RadioGroup>

//             </StyledPopper>

//           </Box>

//         </Stack>

//       </ClickAwayListener>

//     </Stack>

//   );

// };

// export default SelectByCategory;
