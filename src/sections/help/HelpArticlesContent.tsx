import { Avatar, Box, Breadcrumbs, Button, Skeleton, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import policyRules from 'public/icons/policy,rule,reporting.png';
import { useEffect, useState } from 'react';
import { Icon } from 'src/components/Icon';
import { useSetIsUsefulArticleCommandMutation } from 'src/_requests/graphql/upload/mutations/setIsUsefulArticleCommand.generated';
import { useLazyGetHelpArticlesQueryQuery } from 'src/_requests/graphql/upload/queries/getHelpArticlesQuery.generated';
import { useLazyGetHelpRelatedArticlesQueryQuery } from 'src/_requests/graphql/upload/queries/getHelpRelatedArticles.generated';

interface isUsefulAtricleProps {
  isUseful: boolean;
  articleId: string;
}

function HelpArticlesContent(props: {
  articelId: string;
  setIsArticleId: React.Dispatch<React.SetStateAction<string>>;
  articleContents;
}) {
  const { articelId, setIsArticleId, articleContents } = props;
  const [showThanks, setShowThanks] = useState(false);
  const [setIsUsefulArticle, { isLoading }] = useSetIsUsefulArticleCommandMutation();
  const [getHelpArticle, { data: articleData, isFetching }] = useLazyGetHelpArticlesQueryQuery();
  const [getHelpRelatedArticles, { data: relatedArticlesData }] = useLazyGetHelpRelatedArticlesQueryQuery();

  const articleContentss = articleData?.getHelpArticlesQuery?.listDto?.items?.[0];
  const relatedArticles = relatedArticlesData?.getHelpRelatedArticlesQuery?.listDto?.items;

  useEffect(() => {
    getHelpArticle({ filter: { ids: [articelId], slug: 'en-US', pageSize: 1, pageIndex: 0, dto: { searchTerm: '' } } });
    // FIXME: At The Present We Use Mock Data, After That We Must Use articelId (For Sending Id Dynamicly)
    getHelpRelatedArticles({ filter: { dto: { id: '61010e7f-6fc0-4179-9bd7-659aaf8dc176' } } });
  }, [articelId, getHelpArticle, getHelpRelatedArticles]);

  const handleLikeArticle = async (likeValue: boolean) => {
    const resData: any = await setIsUsefulArticle({
      article: {
        dto: { articleId: '61010e7f-6fc0-4179-9bd7-659aaf8dc176', isUseful: likeValue },
      },
    });
    console.log(resData?.data?.setIsUsefulArticleCommand?.isSuccess);
    if (resData?.data?.setIsUsefulArticleCommand?.isSuccess) {
      setShowThanks(true);
    }
  };

  return (
    <Stack sx={{ width: 648, bgcolor: 'background.paper', borderRadius: 1, p: 3, overflowY: 'scroll' }}>
      {/* //--------------------------- Header ---------------------------// */}

      <Stack alignItems="center" sx={{ backgroundColor: 'grey.100', py: 3, borderRadius: 1, mb: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Image src={policyRules} alt="Policy,Rule,Reporting Icon" />
        </Box>
        <Typography variant="h6" color="text.secondary">
          {articleContentss?.categoryTitle}
        </Typography>
      </Stack>

      {/* //--------------------------- BreadCrumbs ---------------------------// */}

      <Breadcrumbs aria-label="breadcrumb" separator="›" sx={{ color: 'info.main', mb: 2 }}>
        {}
        <Typography
          variant="caption"
          color="text.primary"
          onClick={() => setIsArticleId('')}
          sx={{ cursor: 'pointer' }}
        >
          Help Center
        </Typography>
        {/* FIXME: Fix The Address */}
        <Typography variant="caption" color="info.main" onClick={() => setIsArticleId('')}>
          {articleContentss?.categoryTitle}
        </Typography>
        <Typography variant="caption" color="info.main">
          {articleContentss?.title}
        </Typography>
      </Breadcrumbs>

      {/* //--------------------------- Articles Title & Paragraphs ---------------------------// */}
      {isFetching ? (
        <>
          <Skeleton width={300} height={50} />
          {[...Array(8)].map((i, index) => (
            <Skeleton height={35} sx={{ borderRadius: 1 }} key={index} />
          ))}
        </>
      ) : (
        <Stack sx={{ mb: 3.8 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {articleContentss?.title}
          </Typography>
          <Typography variant="body1">{articleContentss?.content}</Typography>
        </Stack>
      )}
      {/* //--------------------------- Poll About Helpful Or Not? ---------------------------// */}

      <Stack sx={{ borderWidth: 1, borderStyle: 'solid', borderColor: 'grey.100', borderRadius: 1, py: 1 }}>
        {showThanks ? (
          <>
            <Stack justifyContent="center" alignItems="center" sx={{ mt: 1 }}>
              <Icon name="Approve-Tick" type="solid" color="success.main" />
              <Typography variant="subtitle2" color="success.main" sx={{ my: 2 }}>
                Thanks for letting us know
              </Typography>
            </Stack>
          </>
        ) : (
          <>
            <Typography variant="body2" sx={{ px: 2 }}>
              Was this helpful?
            </Typography>
            <Stack direction="row" spacing={1} sx={{ px: 1, mt: 2 }}>
              <Button
                color="inherit"
                size="medium"
                sx={{ width: 288, py: 1, bgcolor: 'grey.100' }}
                onClick={() => handleLikeArticle(true)}
              >
                <Icon name="Like" color="grey.500" />
                <Typography sx={{ pr: 1 }}> Yes </Typography>
              </Button>
              <Button
                color="inherit"
                size="medium"
                sx={{ width: 288, py: 1, bgcolor: 'grey.100' }}
                onClick={() => handleLikeArticle(false)}
              >
                <Icon name="Dislike" color="grey.500" />
                <Typography sx={{ pr: 1 }}> No </Typography>
              </Button>
            </Stack>
          </>
        )}
      </Stack>

      {/* //--------------------------- Related Articles ---------------------------// */}

      <Stack sx={{ mt: 3.8 }}>
        <Typography variant="subtitle1">Related Articles</Typography>
        {relatedArticles?.map((article) => (
          <>
            <Stack
              direction="row"
              alignItems="center"
              sx={{ py: 1, borderRadius: 1, cursor: 'pointer' }}
              onClick={() => setIsArticleId(article?.id)}
            >
              <Avatar sx={{ bgcolor: 'background.neutral', ml: 0.5, mr: 1.3 }}>
                <Icon name="notes" color="grey.700" />
              </Avatar>
              <Typography alignContent="center" variant="body2" color="text.primary">
                {article?.title}
              </Typography>
            </Stack>
          </>
        ))}
      </Stack>
    </Stack>
  );
}

export default HelpArticlesContent;
