/* eslint-disable camelcase */
import React from 'react';
import {
  compose, pure, setDisplayName, withHandlers, withState,
} from 'recompose';
import { find } from 'lodash';

import { Row, Column } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import Chip from '@ncigdc/uikit/Chip';

import { styles } from '../SelectSet';
import SelectScrnaSeqWorkflow from './SelectScrnaSeqWorkflow';

const enhance = compose(
  setDisplayName('SelectScrnaSeqPresentation'),
  withState('selectedCase', 'setSelectedCase', null),
  withState('selectedFile', 'setSelectedFile', null),
  withHandlers({
    handleSetSelectedCase: ({
      setSelectedCase,
      setSelectedFile,
      viewer: { repository: { cases: { hits: { edges } } } },
    }) => (e) => {
      const caseInput = e.target.value;
      if (caseInput) {
        const caseInputDetails = find(edges, edge => edge.node.case_id === caseInput);
        const {
          case_id,
          disease_type,
          primary_site,
          project: { project_id },
          submitter_id,
        } = caseInputDetails.node;

        setSelectedCase({
          case_id,
          disease_type,
          primary_site,
          project_id,
          submitter_id,
        });
      } else {
        setSelectedCase(null);
      }

      // reset file on case change
      setSelectedFile(null);
    },
  }),
  pure,
);

const SelectScrnaSeq = ({
  analysisProps: {
    Icon,
    label,
  },
  handleSetSelectedCase,
  onCancel,
  onRun,
  selectedCase,
  selectedFile,
  setSelectedFile,
  viewer: { repository: { cases: { hits } } },
}) => {
  const scrnaSeqCases = hits && hits.edges;
  return (
    <Column
      style={{
        paddingLeft: '1rem',
        paddingTop: '2rem',
        width: '70%',
      }}
      >
      <Row
        spacing="10px"
        style={{
          ...styles.rowStyle,
          justifyContent: 'space-between',
        }}
        >
        <Icon />
        <Column style={{ flex: 1 }}>
          <h1
            style={{
              alignItems: 'center',
              display: 'flex',
              fontSize: '2rem',
            }}
            >
            {label}
            <Chip
              label="BETA"
              style={{
                marginLeft: '1rem',
              }}
              />

          </h1>
          <p>Try out the beta release of our new analysis tool for single cell RNA sequencing data.  Display a demo of different clustering visualizations for this data from a sample case.</p>
          <p>
            {'Please send us your feedback at: '}

            <a href="mailto:support@nci-gdc.datacommons.io">support@nci-gdc.datacommons.io</a>
          </p>
        </Column>
        <Column style={{ paddingTop: 5 }}>
          <Row spacing="5px">
            <Button onClick={onCancel}>Back</Button>
          </Row>
        </Column>
      </Row>

      {scrnaSeqCases.length === 0
        ? (
          <p style={{ margin: 20 }}>No cases with single cell RNA sequencing data found.</p>
        ) : (
          <Row style={styles.rowStyle}>
            <Column
              style={{
                flex: 1,
                marginBottom: 15,
              }}
              >
              <h2
                style={{
                  color: '#c7254e',
                  fontSize: '1.8rem',
                }}
                >
                Step 1: Select a case to demo
              </h2>
              <label
                htmlFor="scrnaseq-select-case"
                style={{ marginBottom: 15 }}
                >
                Select a demo case with single cell RNA sequencing data available for visualization.
              </label>
              <select
                id="scrnaseq-select-case"
                name="scrnaseq-select-case"
                onChange={handleSetSelectedCase}
                style={{ width: 300 }}
                >
                <option value="">-- Select a case --</option>
                {scrnaSeqCases.map(({ node: { case_id, submitter_id } }) => (
                  <option
                    key={case_id}
                    value={case_id}
                    >
                    {submitter_id}
                  </option>
                ))}
              </select>
            </Column>
          </Row>
        )}

      {selectedCase && (
        <Row style={styles.rowStyle}>
          <Column
            style={{
              flex: 1,
              marginBottom: 15,
            }}
            >
            <h2
              style={{
                color: '#c7254e',
                fontSize: '1.8rem',
              }}
              >
              Step 2: Select a workflow
            </h2>
            <div
              id="scrnaseq-select-workflow-description"
              style={{ marginBottom: 15 }}
              >
              Select an analysis workflow that was used for the selected demo case.
            </div>
            <SelectScrnaSeqWorkflow
              case_id={selectedCase.case_id}
              setSelectedFile={setSelectedFile}
              />
          </Column>
        </Row>
      )}

      <Row
        style={{
          ...styles.rowStyle,
          border: 'none',
          justifyContent: 'flex-end',
        }}
        >
        <Button
          disabled={!(selectedCase && selectedFile)}
          onClick={() => onRun(selectedCase, selectedFile)}
          >
          Run
        </Button>
      </Row>
    </Column>
  );
};

export default enhance(SelectScrnaSeq);
