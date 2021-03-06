import {
  compose,
  pure,
  setDisplayName,
  withHandlers,
  withProps,
  withState,
} from 'recompose';
import { find } from 'lodash';
import urlJoin from 'url-join';

import DropDown from '@ncigdc/uikit/Dropdown';
import DropdownItem from '@ncigdc/uikit/DropdownItem';
import Button from '@ncigdc/uikit/Button';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import { AUTH_API } from '@ncigdc/utils/constants';
import download from '@ncigdc/utils/download';
import DownloadIcon from '@ncigdc/theme/icons/Download';
import Spinner from '@ncigdc/theme/icons/Spinner';

const enhance = compose(
  setDisplayName('EnhancedAnalysisDownloadsButton'),
  pure,
  withProps(({
    viewer: { repository: { files: { hits: { edges = [] } } } },
  }) => ({
    analysisFiles: edges.map(({ node }) => ({
      ...node,
      label: node.data_type === 'Single Cell Analysis'
        ? 'Cell Counts'
        : node.data_type,
    })),
  })),
  withState('active', 'setActive', false),
  withHandlers({
    handleAnalysisClick: ({
      analysisFiles,
      case_id,
      setActive,
    }) => (data_type) => () => {
      setActive(true);
      const analysisFile = find(analysisFiles, file => file.data_type === data_type);
      const params = {
        filename: analysisFile.file_name,
        ids: analysisFile.file_id,
        size: analysisFile.file_size,
      };
      download({
        method: 'POST',
        params,
        url: urlJoin(AUTH_API, 'data?annotations=true&related_files=true'),
      })(() => {}, () => setActive(false));
    },
  }),
);

const AnalysisDownloadsButton = ({
  active, analysisFiles, handleAnalysisClick,
}) => {
  return (
    <DropDown
      button={(
        <Tooltip
          Component={<div>Analysis Downloads</div>}
          >
          <Button disabled={active}>
            {active ? <Spinner key="icon" /> : <DownloadIcon key="icon" />}
            <span style={{ marginLeft: 6 }}>
              {active ? 'Processing' : 'Analysis Downloads'}
            </span>
          </Button>
        </Tooltip>
      )}
      dropdownStyle={{
        // move to the right to compensate for
        // div added by relay component
        right: -172,
        width: 200,
      }}
      isDisabled={active || analysisFiles.length === 0}
      >
      {analysisFiles.map(file => (
        <DropdownItem
          key={file.label}
          onClick={handleAnalysisClick(file.data_type)}
          style={{
            cursor: 'pointer',
            width: 'auto',
          }}
          >
          {file.label}
        </DropdownItem>
      ))}
    </DropDown>
  );
};

export default enhance(AnalysisDownloadsButton);
