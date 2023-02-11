import Image from 'next/image';
import React from 'react';

function PostImage({ PostPic }: any) {
  return (
    <div>
      <Image src={PostPic} alt="user" layout="responsive" />{' '}
    </div>
  );
}

export default PostImage;
