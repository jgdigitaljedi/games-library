import { Button } from 'primereact/button';
import React, { FunctionComponent, useState } from 'react';
import './VideoGallery.scss';

interface IProps {
  videos: string[];
}

const VideoGallery: FunctionComponent<IProps> = ({ videos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentVideo, setCurrentVideo] = useState(
    `https://www.youtube.com/embed/${videos[0]}?&autoplay=1`
  );

  const changeVideo = (forward: boolean) => {
    let newIndex = currentIndex;
    if (forward) {
      newIndex++;
    } else {
      newIndex--;
    }
    setCurrentIndex(newIndex);
    setCurrentVideo(`https://www.youtube.com/embed/${videos[newIndex]}?&autoplay=1`);
  };

  return (
    <div className="video-gallery">
      <div className="video-gallery--container">
        <Button
          icon="pi pi-arrow-left"
          style={{ fontSize: '4rem' }}
          disabled={currentIndex === 0}
          onClick={() => changeVideo(false)}
        />
        <div>
          <iframe
            width="560"
            height="315"
            title={`Video game ${videos[currentIndex]}`}
            src={currentVideo}
            className="video-gallery--container__video"
          />
        </div>
        <Button
          icon="pi pi-arrow-right"
          style={{ fontSize: '4rem' }}
          disabled={currentIndex === videos.length - 1}
          onClick={() => changeVideo(true)}
        />
      </div>
    </div>
  );
};

export default VideoGallery;
