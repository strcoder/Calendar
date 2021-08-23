import React from 'react';
import './styles.scss';

const Footer = () => {
  return (
    <footer className='Footer'>
      <p>
        <strong>Made with ♥ by</strong>
        <a href="http://agvcoder.com" target='_blank' className='btn-link-accent'>
          agvcoder
        </a>
      </p>
    </footer>
  );
}

export default Footer;