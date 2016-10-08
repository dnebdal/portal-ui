/* @flow */

import React from 'react';
import Relay from 'react-relay';

import TermAggregation from '@ncigdc/components/Aggregations/TermAggregation';

import type { TBucket } from '@ncigdc/components/Aggregations/types';

export type TProps = {
  aggregations: {
    access: { buckets: [TBucket] },
    data_category: { buckets: [TBucket] },
    data_format: { buckets: [TBucket] },
    data_type: { buckets: [TBucket] },
    experimental_strategy: { buckets: [TBucket] },
    platform: { buckets: [TBucket] },
  },
};

export const FileAggregationsComponent = (props: TProps) => {
  const docType = 'files';
  const facets = [
    'access',
    'data_category',
    'data_format',
    'data_type',
    'experimental_strategy',
    'platform',
  ];
  return (
    <div>
      {facets.map(f => (
        <TermAggregation
          key={`${docType}.${f}`}
          field={`${docType}.${f}`}
          buckets={props.aggregations[f].buckets}
        />
      ))}
    </div>
  );
};

export const FileAggregationsQuery = {
  fragments: {
    aggregations: () => Relay.QL`
      fragment on FileAggregations {
        access {
          buckets {
            doc_count
            key
          }
        }
        data_category {
          buckets {
            doc_count
            key
          }
        }
        data_format {
          buckets {
            doc_count
            key
          }
        }
        data_type {
          buckets {
            doc_count
            key
          }
        }
        experimental_strategy {
          buckets {
            doc_count
            key
          }
        }
        platform {
          buckets {
            doc_count
            key
          }
        }
      }
    `,
  },
};

const FileAggregations = Relay.createContainer(
  FileAggregationsComponent,
  FileAggregationsQuery
);

export default FileAggregations;