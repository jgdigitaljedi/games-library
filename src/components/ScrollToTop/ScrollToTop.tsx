import React, { FunctionComponent, memo, useState } from 'react';
import { Button } from 'primereact/button';
import './ScrollToTop.scss';

interface IProps {
  position: string;
}

const ScrollToTop: FunctionComponent<IProps> = memo(({ position }) => {
  const [showScroll, setShowScroll] = useState<boolean>(false);
  const [animationClass, setAnimationClass] = useState('hide');

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const checkScrollTop = () => {
    if (!showScroll && window.pageYOffset > 400) {
      setShowScroll(true);
      setAnimationClass('show');
    } else if (showScroll && window.pageYOffset <= 400) {
      setAnimationClass('hide');
      setTimeout(() => {
        setShowScroll(false);
      }, 490);
    }
  };

  window.addEventListener('scroll', checkScrollTop);

  return (
    <>
      {showScroll && (
        <div className="scroll-to-top">
          <Button
            className={`p-button-warning scroll-to-top-button position-${position} stt-${animationClass}`}
            icon="pi pi-angle-double-up"
            onClick={scrollTop}
          />
        </div>
      )}
    </>
  );
});

export default ScrollToTop;
