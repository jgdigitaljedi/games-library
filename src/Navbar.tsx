import React, { useState, FunctionComponent } from 'react';
import { Link } from '@reach/router';
import { css } from '@emotion/core';
import colors from './style/colors';

const Navbar: FunctionComponent = () => {
  const [padding] = useState(15);
  return (
    <header
      className="navbar"
      css={css`
        background-color: ${colors.secondary};
        padding: ${padding}px;
      `}
    >
      <Link to="/">Home</Link>
      <Link to="/">Decider</Link>
      <Link to="/">Lists</Link>
      <span
        role="img"
        aria-label="logo"
        css={css`
          font-size: 60px;
          display: inline-block;
          &:hover {
            text-decoration: underline;
          }
        `}
      ></span>
    </header>
  );
};

export default Navbar;
