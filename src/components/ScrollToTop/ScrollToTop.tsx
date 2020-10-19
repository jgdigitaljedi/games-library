import React, { FunctionComponent, useState } from 'react';
import { Button } from 'primereact/button';
import './ScrollToTop.scss';


interface IProps {
  position: string;
}

const ScrollToTop: FunctionComponent<IProps> = ({position}) => {
  const [showScroll, setShowScroll] = useState<boolean>(false);

  const scrollTop = () =>{
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  const checkScrollTop = () => {
    if (!showScroll && window.pageYOffset > 400) {
      setShowScroll(true);
    } else if (showScroll && window.pageYOffset <= 400) {
      setShowScroll(false);
    }
  };

  window.addEventListener('scroll', checkScrollTop);

  return (
    <>
    {showScroll && <div className="scroll-to-top">
      <Button className={`p-button-warning scroll-to-top-button position-${position}`} icon="pi pi-angle-double-up" onClick={scrollTop} />
    </div>
  }
  </>
  );
};

export default ScrollToTop;
