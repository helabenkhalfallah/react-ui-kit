import React from 'react';
import { Button, } from 'antd';
import {
  string,
  bool,
  func,
  node,
} from 'prop-types';
import 'antd/es/button/style';

const RKButton = ({
  disabled,
  type,
  icon,
  size,
  loading,
  shape,
  children,
  onClick,
}) => (
    <Button
      disabled={disabled}
      type={type}
      icon={icon}
      size={size}
      loading={loading}
      shape={shape}
      onClick={onClick}
    >
      {children}
    </Button>
  );

RKButton.propTypes = {
  disabled: bool,
  type: string,
  icon: string,
  size: string,
  loading: bool,
  shape: string,
  children: node,
  onClick: func,
};

RKButton.defaultProps = {
  disabled: false,
  type: null,
  icon: null,
  size: null,
  loading: false,
  shape: null,
  children: null,
  onClick: null,
};

RKButton.displayName = 'RKButton';

export default RKButton;
