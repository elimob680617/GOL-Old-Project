import { Divider, MenuItem, Select, Stack, Typography } from '@mui/material';

import { useRouter } from 'next/router';

import { FC, useEffect, useState } from 'react';

import { Icon } from 'src/components/Icon';

import useAuth from 'src/hooks/useAuth';

import Donations from './Donations';

import Drafts from './Drafts';

import Reports from './Reports';

import SelectByCategory from './SelectByCategory';

const SideBar: FC<{ category: number; setCategory: (category: number) => void }> = ({ category, setCategory }) => {
  const { user } = useAuth();

  return (
    <Stack
      sx={{
        py: 3,

        px: 2,

        bgcolor: 'common.white',

        width: 361,

        borderRadius: 1,

        overflowY: 'auto',

        height: 'fit-content',

        maxHeight: '100%',
      }}
      spacing={2}
    >
      <SelectByCategory categorySelected={setCategory} selectedCategory={category} />

      <Divider />

      {user?.userType === 'NGO' && (
        <>
          <Drafts />

          <Divider />

          <Reports />

          <Divider />
        </>
      )}

      <Donations />
    </Stack>
  );
};

export default SideBar;
