import { useEffect, useMemo } from 'react';

import { useLazyGetCampaignCategoriesQueryQuery } from 'src/_requests/graphql/post/campaign-post/queries/getCampaignCategoriesQuery.generated';

const useCampgingCategories = () => {
  const [camapginCategoryRequest, { data: camapginCategories }] = useLazyGetCampaignCategoriesQueryQuery();

  useEffect(() => {
    camapginCategoryRequest({ filter: { all: true } });
  }, []);

  return useMemo(() => camapginCategories, [camapginCategories]);
};

export default useCampgingCategories;
