// @flow

// Vendor
import React from "react";
import { compose } from "recompose";
import { createFragmentContainer, graphql } from "react-relay/compat";
import { connect } from "react-redux";
import FileIcon from "react-icons/lib/fa/file-o";
import CaseIcon from "react-icons/lib/fa/user";
import FileSizeIcon from "react-icons/lib/fa/floppy-o";

// Custom
import formatFileSize from "@ncigdc/utils/formatFileSize";
import { userCanDownloadFile } from "@ncigdc/utils/auth";
import { Row, Column } from "@ncigdc/uikit/Flex";
import { withTheme } from "@ncigdc/theme";
import FileTable from "@ncigdc/containers/FileTable";
import MetadataDownloadButton from "@ncigdc/components/MetadataDownloadButton";
import SummaryCard from "@ncigdc/components/SummaryCard";
import HowToDownload from "@ncigdc/components/HowToDownload";
import CountCard from "@ncigdc/components/CountCard";
import CartDownloadDropdown from "@ncigdc/components/CartDownloadDropdown";
import RemoveFromCartButton from "@ncigdc/components/RemoveFromCartButton";

/*----------------------------------------------------------------------------*/

const getAuthCounts = ({ user, files }) => {
  const defaultData = {
    authorized: { count: 0, file_size: 0 },
    unauthorized: { count: 0, file_size: 0 }
  };

  const authCountAndFileSizes = files.reduce((result, file) => {
    const canDownloadKey = userCanDownloadFile({ user, file })
      ? "authorized"
      : "unauthorized";
    result[canDownloadKey].count += 1;
    result[canDownloadKey].file_size += file.file_size;
    return result;
  }, defaultData);

  return [
    {
      key: "Authorized",
      doc_count: authCountAndFileSizes.authorized.count || 0,
      file_size: authCountAndFileSizes.authorized.file_size
    },
    {
      key: "Unauthorized",
      doc_count: authCountAndFileSizes.unauthorized.count || 0,
      file_size: authCountAndFileSizes.unauthorized.file_size
    }
  ].filter(i => i.doc_count);
};

export type TProps = {
  files: Array<Object>,
  theme: Object,
  user: Object,
  viewer: {
    repository: {
      files: {
        aggregations: string,
        hits: string
      }
    },
    summary: {
      aggregations: {
        fs: { value: number },
        project__project_id: {
          buckets: Array<{
            case_count: number,
            doc_count: number,
            file_size: number,
            key: string
          }>
        }
      }
    }
  }
};

type TCartPage = (props: TProps) => React.Element<*>;
const CartPage: TCartPage = ({ viewer, files, user, theme } = {}) => {
  const authCounts = getAuthCounts({ user, files });

  const styles = {
    container: {
      padding: "2rem 2.5rem 13rem"
    },
    header: {
      padding: "1rem",
      borderBottom: `1px solid ${theme.greyScale4}`,
      color: theme.primary
    }
  };

  return (
    <Column style={styles.container}>
      {!files.length && <h1>Your cart is empty.</h1>}
      {!!files.length &&
        !!viewer.repository.files.hits &&
        <Column>
          <Row spacing="2rem" style={{ marginBottom: "2rem" }}>
            <Column spacing="0.8rem">
              <CountCard
                title="FILES"
                count={files.length}
                icon={<FileIcon style={{ width: "4rem", height: "4rem" }} />}
                style={{ backgroundColor: "transparent" }}
              />
              <CountCard
                title="CASES"
                count={viewer.summary.aggregations.project__project_id.buckets.reduce(
                  (sum, bucket) => sum + bucket.case_count,
                  0
                )}
                icon={<CaseIcon style={{ width: "4rem", height: "4rem" }} />}
                style={{ backgroundColor: "transparent" }}
              />
              <CountCard
                title="FILE SIZE"
                count={formatFileSize(viewer.summary.aggregations.fs.value)}
                icon={
                  <FileSizeIcon style={{ width: "4rem", height: "4rem" }} />
                }
                style={{ backgroundColor: "transparent" }}
              />
            </Column>
            <SummaryCard
              style={{
                flex: 1,
                backgroundColor: "transparent",
                height: "19em",
                overflow: "auto"
              }}
              tableTitle="File Counts by Project"
              pieChartTitle="File Counts by Project"
              data={viewer.summary.aggregations.project__project_id.buckets.map(
                item => ({
                  project: item.key,
                  case_count: item.case_count,
                  file_count: item.doc_count.toLocaleString(),
                  file_size: formatFileSize(item.file_size),
                  tooltip: `${item.key}: ${item.doc_count.toLocaleString()}`
                })
              )}
              footer={`${viewer.summary.aggregations.project__project_id.buckets.length} Projects `}
              path="file_count"
              headings={[
                { key: "project", title: "Project", color: true },
                {
                  key: "case_count",
                  title: "Cases",
                  style: { textAlign: "right" }
                },
                {
                  key: "file_count",
                  title: "Files",
                  style: { textAlign: "right" }
                },
                {
                  key: "file_size",
                  title: "File Size",
                  style: { textAlign: "right" }
                }
              ]}
            />
            <SummaryCard
              style={{
                flex: 1,
                backgroundColor: "transparent",
                height: "19em",
                overflow: "auto"
              }}
              tableTitle="File Counts by Authorization Level"
              pieChartTitle="File Counts by Authorization Level"
              data={authCounts.map(x => ({
                ...x,
                file_size: formatFileSize(x.file_size),
                tooltip: `${x.key}: ${formatFileSize(x.file_size)}`
              }))}
              footer={`${authCounts.length} Authorization Levels`}
              path="doc_count"
              headings={[
                { key: "key", title: "Level", color: true },
                {
                  key: "doc_count",
                  title: "Files",
                  style: { textAlign: "right" }
                },
                {
                  key: "file_size",
                  title: "File Size",
                  style: { textAlign: "right" }
                }
              ]}
            />
            <HowToDownload
              style={{ flex: 1, backgroundColor: "transparent" }}
            />
          </Row>
          <Row style={{ marginBottom: "2rem" }}>
            <Row style={{ marginLeft: "auto" }} spacing="1rem">
              <MetadataDownloadButton files={{ files }} />
              <CartDownloadDropdown files={{ files }} />
              <RemoveFromCartButton />
            </Row>
          </Row>
          <FileTable
            hits={viewer.repository.files.hits}
            downloadable={false}
            canAddToCart={false}
            tableHeader={"Cart Items"}
          />
        </Column>}
    </Column>
  );
};

const enhance = compose(withTheme);

export { CartPage };

export default createFragmentContainer(
  connect(state => ({
    ...state.cart,
    ...state.auth
  }))(enhance(CartPage)),
  {
    /* TODO manually deal with:
  initialVariables: {
    files_offset: null,
    files_size: null,
    filters: null,
    files_sort: null,
  }
  */
    viewer: graphql`
    fragment CartPage_viewer on Root {
      summary: cart_summary {
        aggregations(filters: $filters) {
          project__project_id {
            buckets {
              case_count
              doc_count
              file_size
              key
            }
          }
          fs { value }
        }
      }
      repository {
        files {
          hits(first: $files_size offset: $files_offset, sort: $files_sort filters: $filters) {
            ...FileTable_hits
          }
        }
      }
    }
  `
  }
);