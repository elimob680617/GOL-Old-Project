/* eslint-disable prettier/prettier */
import { Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { PATH_APP } from 'src/routes/paths';
import Body from './Body';
import SideBar from './SideBar';

const CampaginLandingPage = () => {
  const { query, push } = useRouter();
  const [category, setCategory] = useState<number>(0);
  const canSendRequest = useRef<boolean>(false);

  useEffect(() => {
    if (query.search) {
      const search = JSON.parse(query.search as string);
      const searchedCategory = search.category;
      setCategory(searchedCategory);
      canSendRequest.current = true;
    } else {
      setCategory(0);
      canSendRequest.current = true;
    }
  }, []);

  useEffect(() => {
    if (canSendRequest.current && category != null) {
      push(
        { pathname: `${PATH_APP.post.campaginPostLanding}`, query: { search: JSON.stringify({ category }) } },
        undefined,
        { shallow: true }
      );
    }
  }, [category]);

  return (
    <Stack direction="row" spacing={3} sx={{ height: 'calc(100vh - 88px)', overflow: 'hidden', pb: 3 }}>
      <SideBar category={category} setCategory={setCategory} />
      <Body />
    </Stack>
  );
};

export default CampaginLandingPage;
