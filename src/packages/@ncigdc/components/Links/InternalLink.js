import React from 'react';
import _ from 'lodash';
import { NavLink as Link } from 'react-router-dom';
import { stringify } from 'query-string';

import { stringifyJSONParam } from '@ncigdc/utils/uri';
import removeEmptyKeys from '@ncigdc/utils/removeEmptyKeys';
import validAttributes from '@ncigdc/theme/utils/validAttributes';
import { scrollToId } from '@ncigdc/components/Links/deepLink';

import { TLinkProps } from './types';

const reactRouterLinkProps = [
  'to',
  'replace',
  'activeClassName',
  'activeStyle',
  'exact',
  'strict',
  'isActive',
];

const InternalLink = ({
  className = 'unnamed-link',
  deepLink,
  disabled,
  pathname = '',
  query,
  search,
  state,
  style = {},
  testTag = 'untagged-link',
  ...rest
}: TLinkProps) => {
  const q0 = query || {};
  const f0 = q0.filters ? stringifyJSONParam(q0.filters) : null;

  const q1 = {
    ...q0,
    filters: f0,
  };

  const q = removeEmptyKeys(q1);

  const validAttrProps = validAttributes(rest);
  const validLinkProps = _.pick(rest, reactRouterLinkProps);

  const isLinkDisabled = disabled
    ? {
      cursor: 'default',
      pointerEvents: 'none',
    }
    : {};

  return (
    <Link
      className={`${className}${disabled ? ' disabled' : ''}`}
      data-test={testTag}
      to={{
        pathname,
        search: search || stringify(q),
        state,
      }}
      {...validAttrProps}
      {...validLinkProps}
      onClick={event => {
        if (validAttrProps.onClick) {
          validAttrProps.onClick(event);
        }
        if (deepLink) {
          scrollToId(deepLink);
        }
      }}
      style={{
        ...style,
        ...isLinkDisabled,
      }}
      >
      {validAttrProps.children}
    </Link>
  );
};

export default InternalLink;
