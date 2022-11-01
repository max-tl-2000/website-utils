/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

// code originally published under react-clamp-lines. Moved here to fix the bug where
// the component tries to update the state while not mounted. Ideally this component should
// be either removed or we can develop our own simpler versiono of this component
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import debounce from 'debouncy';

export default class ClampLines extends PureComponent {
  constructor(props) {
    super(props);

    this.element = null;
    this.original = props.text;
    this.watch = true;
    this.lineHeight = 0;
    this.start = 0;
    this.middle = 0;
    this.end = 0;
    this.state = {
      noClamp: false,
      text: '.',
    };

    // If window is undefined it means the code is executed server-side
    this.ssr = typeof window === 'undefined';

    this.action = this.action.bind(this);
    this.clickHandler = this.clickHandler.bind(this);

    if (!this.ssr) {
      this.debounced = debounce(this.action, props.delay);
    } else {
      this.state.text = props.text;
    }
  }

  componentDidMount() {
    if (this.props.text && !this.ssr) {
      this.lineHeight = this.element.clientHeight + 1;
      this.clampLines();

      if (this.watch) {
        window.addEventListener('resize', this.debounced);
      }
    }
  }

  componentWillUnmount() {
    this._unmounted = true;
    if (!this.ssr) {
      window.removeEventListener('resize', this.debounced);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.text !== this.props.text) {
      this.original = this.props.text;
      this.clampLines();
    }
  }

  action() {
    if (this._unmounted) return;
    if (this.watch) {
      this.setState({
        noClamp: false,
      });
      this.clampLines();
    }
  }

  clampLines() {
    if (!this.element) return;

    this.setState({
      text: '',
    });

    const maxHeight = this.lineHeight * this.props.lines + 1;

    this.start = 0;
    this.middle = 0;
    this.end = this.original.length;

    while (this.start <= this.end) {
      this.middle = Math.floor((this.start + this.end) / 2);
      this.element.innerText = this.original.slice(0, this.middle);
      if (this.middle === this.original.length) {
        this.setState({
          text: this.original,
          noClamp: true,
        });
        return;
      }

      this.moveMarkers(maxHeight);
    }

    this.element.innerText = this.original.slice(0, this.middle - 5) + this.getEllipsis();
    this.setState({
      text: this.original.slice(0, this.middle - 5) + this.getEllipsis(),
    });
  }

  moveMarkers(maxHeight) {
    if (this.element.clientHeight <= maxHeight) {
      this.start = this.middle + 1;
    } else {
      this.end = this.middle - 1;
    }
  }

  getClassName() {
    const className = this.props.className || '';

    return `clamp-lines ${className}`;
  }

  getEllipsis() {
    return this.watch && !this.state.noClamp ? this.props.ellipsis : '';
  }

  getButton() {
    if (this.state.noClamp || !this.props.buttons) return <noscript />;

    const buttonText = this.watch ? this.props.moreText : this.props.lessText;

    return (
      <button type="button" className="clamp-lines__button" onClick={this.clickHandler}>
        {buttonText}
      </button>
    );
  }

  clickHandler(e) {
    const { stopPropagation } = this.props;
    e.preventDefault();
    stopPropagation && e.stopPropagation();

    this.watch = !this.watch;
    this.watch
      ? this.clampLines()
      : this.setState({
          text: this.original,
        });
  }

  render() {
    const { props } = this;
    const { text, lines, ellipsis, buttons, moreText, lessText, className, delay, stopPropagation, ...rest } = props;
    if (!text) {
      return null;
    }

    return (
      <div className={this.getClassName()} {...rest}>
        <div
          ref={e => {
            this.element = e;
          }}>
          {this.state.text}
        </div>
        {this.getButton()}
      </div>
    );
  }
}

ClampLines.propTypes = {
  text: PropTypes.string.isRequired,
  lines: PropTypes.number,
  ellipsis: PropTypes.string,
  buttons: PropTypes.bool,
  moreText: PropTypes.string,
  lessText: PropTypes.string,
  className: PropTypes.string,
  delay: PropTypes.number,
  stopPropagation: PropTypes.bool,
};

ClampLines.defaultProps = {
  lines: 3,
  ellipsis: '...',
  buttons: true,
  moreText: 'Read more',
  lessText: 'Read less',
  delay: 300,
};
