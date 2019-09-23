import React, { Fragment, } from 'react';
import {
  node,
} from 'prop-types';
import './ant.less';

const LazyCssComponent = ({
  children,
}) => (
    <Fragment>
      {children}
    </Fragment>
  );

LazyCssComponent.propTypes = {
  children: node,
};

LazyCssComponent.defaultProps = {
  children: null,
};

export default LazyCssComponent;
