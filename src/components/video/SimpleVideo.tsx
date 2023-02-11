import { FC, useEffect, useRef, useState } from 'react';
import useOnScreen from 'src/hooks/useIsVisiable';
import {
  addInViewPortVideo,
  getInViewPortVideos,
  getPlayingVideos,
  removeInViewPortVideo,
  removePlayingVideo,
  setPlayingVideo,
} from 'src/redux/slices/homePage';
import { useDispatch, useSelector } from 'src/redux/store';

interface ISimpleVideoProps {
  autoShow?: boolean;
  src: string;
  controls?: boolean;
  width?: number;
  height?: number;
  maxHeight?: number;
}

const SimpleVideo: FC<ISimpleVideoProps> = (props) => {
  const { autoShow, src, controls, width, height, maxHeight } = props;
  const dispatch = useDispatch();
  const inViewVideos = useSelector(getInViewPortVideos);
  const playingVideos = useSelector(getPlayingVideos);
  const videoRef = useRef<any>(null);
  const ref = useRef<any>(null);
  const onScreen: boolean = useOnScreen<HTMLDivElement>(ref, ref.current ? `-${ref.current.offsetHeight}px` : '');
  const [autoPlay, setAutoPlay] = useState<boolean>(false);

  useEffect(() => {
    if (onScreen && autoShow) {
      dispatch(addInViewPortVideo({ link: src, positionTop: ref.current!.offsetTop }));
    } else if (!onScreen && autoShow) {
      pauseVideo();
      dispatch(removePlayingVideo(src));
      dispatch(removeInViewPortVideo(src));
    }
  }, [autoShow, dispatch, onScreen, src]);

  useEffect(() => {
    if (inViewVideos.length === 0) {
      return;
    }
    if (inViewVideos[0] && inViewVideos[0].link === src) {
      if (!autoPlay) {
        setAutoPlay(true);
        videoRef.current!.play();
        dispatch(setPlayingVideo(src));
      }
    }
  }, [autoPlay, dispatch, inViewVideos, src]);

  useEffect(() => {
    const videoIndex = playingVideos.findIndex((i) => i === src);
    if (videoIndex >= 0) {
      if (inViewVideos[0] && inViewVideos[0].link !== src) {
        pauseVideo();
        dispatch(removePlayingVideo(src));
      }
    }
  }, [dispatch, inViewVideos, playingVideos, src]);

  const pauseVideo = () => {
    setAutoPlay(false);
    videoRef.current!.pause();
  };

  // useEffect(() => {
  //   if (onScreen && autoShow) {
  //     setAutoPlay(true);
  //     videoRef.current.play();
  //   } else {
  //     setAutoPlay(false);
  //     videoRef.current.pause();
  //   }
  // }, [onScreen]);

  // function msToTime(s: any) {
  //   const ms = s % 1000;
  //   s = (s - ms) / 1000;
  //   const secs = s % 60;
  //   s = (s - secs) / 60;
  //   const mins = s % 60;
  //   const hrs = (s - mins) / 60;
  //   if (hrs === 0) {
  //     return mins + ':' + secs + ms;
  //   } else {
  //     return hrs + ':' + mins + ':' + secs;
  //   }
  // }
  return (
    <div
      style={{
        maxHeight: maxHeight ? maxHeight : '30rem',
        maxWidth: '30rem',
        height: height ? height : '100%',
        width: width ? width : '100%',
        margin: '0 auto',
      }}
      ref={ref}
    >
      <video
        style={{
          maxHeight: maxHeight ? maxHeight : '30rem',
          maxWidth: '30rem',
          height: height ? height : '30rem',
          width: width ? width : '100%',
        }}
        id={src}
        muted={autoPlay}
        controls={controls}
        autoPlay={autoPlay}
        ref={videoRef}
        key={src}
      >
        <source src={src} />
      </video>
    </div>
  );
};

export default SimpleVideo;
