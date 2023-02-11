import React from 'react';
// layouts
import Layout from 'src/layouts';
import ConnectionLayout from 'src/sections/connections/ConnectionLayout';

// ----------------------------------------------------------------------
connections.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout variant="simple">{page}</Layout>;
};
// ----------------------------------------------------------------------

export default function connections() {
  return <ConnectionLayout />;
}
