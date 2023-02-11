import {
  Avatar,
  Box,
  CircularProgress,
  Collapse,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { Icon } from 'src/components/Icon';

const BoxStyle = styled(Box)(({ theme }) => ({
  width: 360,
  alignContent: 'center',
  backgroundColor: theme.palette.background.paper,
  maxHeight: '80vh',
  height: 'max-content',
  borderRadius: theme.spacing(1),
  overflowY: 'scroll',
  overflowX: 'hidden',
}));

const ListStyle = styled('nav')(({ theme }) => ({
  maxWidth: 360,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  maxHeight: '70vh',
  overflowY: 'scroll',
}));

function HelpSideBar(props: {
  setIsArticleId: React.Dispatch<React.SetStateAction<string>>;
  searchBarData;
  setSearchBarData: React.Dispatch<React.SetStateAction<string>>;
  helpCategories;
  articleContents;
  articleFetching;
  categoryFetching;
}) {
  const {
    setIsArticleId,
    searchBarData,
    setSearchBarData,
    helpCategories,
    articleContents,
    articleFetching,
    categoryFetching,
  } = props;
  const [isSeeMore, setIsLoadMore] = useState<Record<string, boolean>>({});
  const [isSeeMoreSubCategory, setIsLoadMoreSubCategory] = useState<Record<string, boolean>>({});

  const handleSeeMoreClick = (key: string) => {
    setIsLoadMore({ ...isSeeMore, [key]: !isSeeMore[key] });
  };

  const handleSeeMoreSubCategory = (key: string) => {
    setIsLoadMoreSubCategory({ ...isSeeMoreSubCategory, [key]: !isSeeMoreSubCategory[key] });
  };

  return (
    <BoxStyle>
      <TextField
        onChange={(e) => setSearchBarData(e.target.value)}
        size="small"
        name="search"
        type="text"
        placeholder="Search for help articles"
        sx={{ mb: 1, mt: 2, mx: 2, width: 328 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Icon name="Research" type="solid" color="grey.500" />
            </InputAdornment>
          ),
        }}
      />
      {searchBarData.length > 2 ? (
        <>
          {articleFetching ? (
            <Stack justifyContent="center" alignItems="center" sx={{ m: '0 auto' }}>
              <CircularProgress size={30} sx={{ my: 3 }} />
            </Stack>
          ) : (
            <Stack sx={{ my: 2 }}>
              {articleContents?.map((search) => (
                <>
                  <Stack
                    direction="row"
                    alignItems="center"
                    onClick={() => {
                      setIsArticleId(search?.id);
                      // query?.help?.(search?.id);
                    }}
                    sx={{ bgcolor: 'background.paper', borderRadius: 1, cursor: 'pointer', overflow: 'scroll' }}
                  >
                    <Avatar sx={{ bgcolor: 'background.neutral', mx: 2 }}>
                      <Icon name="notes" color="grey.700" />
                    </Avatar>
                    <Typography alignContent="center" variant="body2" color="text.primary">
                      {search?.title}
                    </Typography>
                  </Stack>
                </>
              ))}
            </Stack>
          )}
        </>
      ) : (
        <>
          {categoryFetching ? (
            <Stack justifyContent="center" alignItems="center" sx={{ m: '0 auto' }}>
              <CircularProgress size={30} sx={{ my: 3 }} />
            </Stack>
          ) : (
            <ListStyle aria-labelledby="nested-list-subheader">
              {/* //--------------------------- Categories ---------------------------// */}

              {helpCategories?.map((category) => (
                <>
                  <ListItemButton
                    onClick={() => handleSeeMoreClick(category?.id)}
                    sx={{ px: 1, py: 2, borderRadius: 1 }}
                    key={category?.id}
                  >
                    <ListItemIcon>{/* <Icon name={category?.iconUrl as string} /> */}</ListItemIcon>
                    <ListItemText>
                      <Typography variant="subtitle1">{category?.title}</Typography>
                    </ListItemText>
                    {!!category?.subCategory?.length &&
                      (isSeeMore[category?.id] ? (
                        <Icon name="upper-arrow" color="grey.500" />
                      ) : (
                        <Icon name="down-arrow" color="grey.500" />
                      ))}
                  </ListItemButton>

                  {category?.subCategory?.map((subCategory) => (
                    <>
                      <Collapse in={isSeeMore[category?.id]} timeout="auto" unmountOnExit key={subCategory?.id}>
                        <List>
                          <ListItemButton
                            onClick={() => handleSeeMoreClick(subCategory?.id)}
                            sx={{ px: 2.5, py: 2, borderRadius: 1 }}
                          >
                            <ListItemIcon>{/* <Icon name={category?.iconUrl as string} /> */}</ListItemIcon>
                            <ListItemText>
                              <Typography variant="subtitle1">{subCategory?.title}</Typography>
                            </ListItemText>
                            {!!subCategory?.articles?.length &&
                              (isSeeMore[subCategory?.id] ? (
                                <Icon name="upper-arrow" color="grey.500" />
                              ) : (
                                <Icon name="down-arrow" color="grey.500" />
                              ))}
                          </ListItemButton>
                          {!!subCategory?.articles?.length && (
                            <Collapse in={isSeeMore[subCategory?.id]} timeout="auto" unmountOnExit>
                              <List component="div" disablePadding sx={{ pl: 3 }}>
                                {subCategory?.articles?.map((item) => (
                                  <ListItemButton onClick={() => handleSeeMoreSubCategory(item?.id)} key={item?.id}>
                                    <ListItemText sx={{ p: 1 }} onClick={() => setIsArticleId(item?.id)}>
                                      <Typography variant="subtitle2">{item?.title}</Typography>
                                    </ListItemText>
                                  </ListItemButton>
                                ))}
                              </List>
                            </Collapse>
                          )}
                        </List>
                      </Collapse>
                    </>
                  ))}
                </>
              ))}
            </ListStyle>
          )}
        </>
      )}
    </BoxStyle>
  );
}

export default HelpSideBar;
