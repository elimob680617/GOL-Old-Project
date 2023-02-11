import React from 'react';
// layouts
import Layout from 'src/layouts';
//component
import Posts from 'src/sections/profile/components/posts/Posts';
//......................................................
posts.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout variant="simple">{page}</Layout>;
};
//.....................................................
function posts() {
  return <Posts />;
}

export default posts;
