/* eslint-disable */
(($) => {
  'use strict';

  const classes = {
    style: 'userlist-style',
  };

  const selectors = {
    style: `.${classes.style}`,
    appendLocation: '.ins-api-users',
  };

  const self = {};

  self.init = () => {
    self.reset();
    self.buildCSS();
    self.buildHTML();
    self.setEvents();
  };

  self.reset = () => {
    $(selectors.style).remove();
  };

  self.buildCSS = () => {
    const customStyle = `
            <style class="${classes.style}">
            </style>
        `;
    $('head').append(customStyle);
  };

  self.buildHTML = () => {
    const html = ``;
    $(selectors.appendLocation).append(html);
  };

  self.setEvents = () => {};

  $(document).ready(self.init);
})(jQuery);
