import { Box, Container, Link, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import GOL from 'public/icons/Gol.png';
import { useEffect, useMemo, useState } from 'react';
import Logo from 'src/components/Logo';
import { PATH_APP } from 'src/routes/paths';
import HelpSideBar from 'src/sections/help/HelpSideBar';
import debounceFn from 'src/utils/debounce';
import { useLazyGetHelpArticlesQueryQuery } from 'src/_requests/graphql/upload/queries/getHelpArticlesQuery.generated';
import { useLazyGetHelpCategoriesQueryQuery } from 'src/_requests/graphql/upload/queries/getHelpCategoriesQuery.generated';
import HelpArticlesContent from './HelpArticlesContent';
import HelpCategoryDetail from './HelpCategoryDetail';
import HelpSuggestionArticles from './HelpSuggestionArticles';

function HelpCenter() {
  const { push } = useRouter();
  const [isArticelId, setIsArticleId] = useState<string>('');
  const [isCategoryId, setIsCategoryId] = useState<string>('');
  const [searchBarData, setSearchBarData] = useState('');

  const [getHelpCategories, { data, isFetching: categoryFetching }] = useLazyGetHelpCategoriesQueryQuery();
  const [getHelpArticle, { data: articleData, isFetching: articleFetching }] = useLazyGetHelpArticlesQueryQuery();

  useEffect(() => {
    getHelpCategories({ filter: { slug: 'en-US' } });
    debounceFn(() => {
      getHelpArticle({
        filter: {
          ids: [],
          slug: 'en-US',
          pageSize: 1,
          pageIndex: 0,
          dto: { searchTerm: searchBarData },
        },
      });
    });
  }, [getHelpCategories, searchBarData]);

  const helpCategory = data?.getHelpCategoriesQuery?.listDto?.items;
  const articleContents = articleData?.getHelpArticlesQuery?.listDto?.items;

  const helpCategories = useMemo(() => {
    const parentCategories = helpCategory?.filter((c) => c?.parentId === null);
    const result = parentCategories?.map((parent) => ({
      ...parent,
      subCategory: helpCategory?.filter((category) => category?.parentId === parent?.id),
    }));
    return result;
  }, [helpCategory]);

  console.log(helpCategories);

  return (
    <>
      <Stack sx={{ position: 'relative' }}>
        <Box width="100%" sx={{ bgcolor: 'background.paper' }}>
          <Container maxWidth="lg">
            <Stack justifyContent="space-between" alignItems="center" direction="row">
              <Stack justifyContent="space-between" alignItems="center" direction="row">
                <Box sx={{ pr: 2, py: 2, cursor: 'pointer' }} onClick={() => push(PATH_APP.home.index)}>
                  <Logo />
                </Box>
                <Link href="./" underline="none">
                  <Typography variant="h6" sx={{ color: 'grey.900', cursor: 'pointer' }}>
                    Help Center
                  </Typography>
                </Link>
              </Stack>
            </Stack>
          </Container>
        </Box>
        <Box sx={{ bgcolor: 'background.neutral', height: 'max-content' }}>
          <Container>
            <Stack direction="row" gap={3} sx={{ my: 3 }}>
              <HelpSideBar
                setIsArticleId={setIsArticleId}
                searchBarData={searchBarData}
                setSearchBarData={setSearchBarData}
                helpCategories={helpCategories}
                articleContents={articleContents}
                categoryFetching={categoryFetching}
                articleFetching={articleFetching}
              />
              {!!isCategoryId ? (
                <HelpCategoryDetail
                  isCategoryId={isCategoryId}
                  setIsCategoryId={setIsCategoryId}
                  setIsArticleId={setIsArticleId}
                  helpCategories={helpCategories}
                />
              ) : (
                <>
                  {!!isArticelId ? (
                    <HelpArticlesContent
                      articelId={isArticelId}
                      setIsArticleId={setIsArticleId}
                      articleContents={articleContents}
                    />
                  ) : (
                    <HelpSuggestionArticles
                      setIsArticleId={setIsArticleId}
                      setIsCategoryId={setIsCategoryId}
                      helpCategories={helpCategories}
                    />
                  )}
                </>
              )}
            </Stack>
          </Container>
        </Box>
        <Box width="100%" height="66px" sx={{ bgcolor: 'background.paper', maxHeight: '66px' }}>
          <Container maxWidth="lg">
            <Stack justifyContent="center" alignItems="center" sx={{ position: 'absolute', bottom: 0 }}>
              <Stack justifyContent="space-between" direction="row" spacing={8} sx={{ py: 3 }}>
                <Stack direction="row" spacing={3}>
                  <Typography variant="subtitle2">Garden Of Love</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Languages
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    About
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Privacy Policy
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Legal
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={3}>
                  <Typography variant="subtitle2">Company</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Terms of Service
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Cookies
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Whitepaper
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Contact GOL
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Container>
        </Box>
      </Stack>
    </>
  );
}

export default HelpCenter;
