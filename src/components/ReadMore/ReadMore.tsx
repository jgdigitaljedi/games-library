import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import './ReadMore.scss';

interface IProps {
  maxChars?: number;
  textString: string;
}

const ReadMore: FunctionComponent<IProps> = ({ maxChars = 250, textString }) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const [displayString, setDisplayString] = useState('');
  const [expanded, setExpanded] = useState(false);

  const truncateText = useCallback(() => {
    return `${textString.substring(0, maxChars - 3)}...`;
  }, [textString, maxChars]);

  const toggleExpanded = () => {
    if (expanded) {
      setExpanded(false);
      setDisplayString(truncateText());
    } else {
      setExpanded(true);
      setDisplayString(textString);
    }
  };

  useEffect(() => {
    if (textString.length - 4 > maxChars) {
      setIsTruncated(true);
      setDisplayString(truncateText());
    } else {
      setDisplayString(textString);
    }
  }, [textString, maxChars, truncateText]);

  return (
    <span className={`read-more`}>
      {displayString}
      {isTruncated && !expanded && (
        <Button label="Show More" className="p-button-link" onClick={toggleExpanded} />
      )}
      {isTruncated && expanded && (
        <Button label="Show Less" className="p-button-link" onClick={toggleExpanded} />
      )}
    </span>
  );
};

export default ReadMore;
