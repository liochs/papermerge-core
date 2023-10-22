/** Container for either <Commander /> or for <Viewer /> */

import { useState, useEffect } from 'react';

import Commander from 'components/commander/commander';
import Viewer from 'components/viewer/viewer';

import {
  NodeClickArgsType,
  NodesType,
  NType,
  ShowDualButtonEnum,
  Sorting,
  Pagination,
  Vow,
  DocumentVersion,
  DocumentType,
  PageAndRotOp,
  BreadcrumbType,
  onMovedNodesType,
  NodeType,
  UUIDList
} from 'types';
import { NodeSortFieldEnum, NodeSortOrderEnum, DisplayNodesModeEnum } from 'types';


type Args = {
  parent_node: NType;
  nodes: Vow<NodesType>;
  onMovedNodes: (args: onMovedNodesType) => void;
  onSelectNodes: (value: UUIDList) => void;
  onDragNodes: (value: UUIDList) => void;
  pagination: Pagination;
  sort: Sorting;
  onNodeClick: (node: NType) => void;
  onSortChange: (sort: Sorting) => void;
  show_dual_button?: ShowDualButtonEnum;
  onNodesListChange: (new_nodes: NodeType[]) => void;
  doc: Vow<DocumentType>;
  doc_versions: Vow<DocumentVersion[]>;
  doc_ver: Vow<DocumentVersion>;
  doc_breadcrumb: Vow<BreadcrumbType>;
  pages: Vow<PageAndRotOp[]>;
  onDocVersionsChange: (doc_versions: DocumentVersion[]) => void;
  onDocVerChange: (doc_ver: DocumentVersion) => void;
  onPagesChange: (pages: PageAndRotOp[]) => void;
  onDocBreadcrumbChange: (new_breadcrumb: BreadcrumbType) => void;
  selected_nodes: UUIDList;
  dragged_nodes: UUIDList;
}

type NodeListParams = {
  page_size: number;
  page_number: number;
  sort_field: NodeSortFieldEnum;
  sort_order: NodeSortOrderEnum;
  display_mode: DisplayNodesModeEnum;
}

type NodeListParamsArg = {
  page_size?: number;
  page_number?: number;
  sort_field?: NodeSortFieldEnum;
  sort_order?: NodeSortOrderEnum;
  display_mode?: DisplayNodesModeEnum;
}


const NODE_LIST_PARAMS = 'node-list-params';
const NODE_LIST_PARAMS_DEFAULT: NodeListParams = {
  'page_size': 10,
  'page_number': 1,
  'sort_field': 'title',
  'sort_order': 'desc',
  'display_mode': DisplayNodesModeEnum.List
};


function get_node_list_params(): NodeListParams {
  let node_list_params_str: string | null = localStorage.getItem(NODE_LIST_PARAMS);
  let result: NodeListParams;

  if (node_list_params_str) {
      // local storage key was found
      try {
        result = JSON.parse(window.atob(node_list_params_str));
        if(result) {
          // local storage key contains meaningfull data
          return result;
        };
        return NODE_LIST_PARAMS_DEFAULT;
      } catch(e) {
        return NODE_LIST_PARAMS_DEFAULT;
      }
  }

  return NODE_LIST_PARAMS_DEFAULT;
}

function save_node_list_params({
  page_size,
  page_number,
  display_mode,
  sort_field,
  sort_order
}: NodeListParamsArg) {

  let nodes_list_params: NodeListParams = get_node_list_params();
  let base64: string;

  if (page_size) {
    nodes_list_params.page_size = page_size;
  }

  if (page_number) {
    nodes_list_params.page_number = page_number;
  }

  if (display_mode) {
    nodes_list_params.display_mode = display_mode;
  }

  if (sort_field) {
    nodes_list_params.sort_field = sort_field;
  }

  if (sort_order) {
    nodes_list_params.sort_order = sort_order;
  }

  base64 = window.btoa(JSON.stringify(nodes_list_params));
  localStorage.setItem(NODE_LIST_PARAMS, base64);
}


function SinglePanel({
  parent_node,
  pagination,
  sort,
  nodes,
  onSelectNodes,
  onDragNodes,
  selected_nodes,
  dragged_nodes,
  onMovedNodes,
  onSortChange,
  onNodeClick,
  show_dual_button,
  onNodesListChange,
  doc,
  doc_versions,
  doc_ver,
  doc_breadcrumb,
  pages,
  onDocVerChange,
  onDocVersionsChange,
  onPagesChange,
  onDocBreadcrumbChange
}: Args) {
  const [ display_mode, set_display_mode ] = useState<DisplayNodesModeEnum>(
    get_node_list_params().display_mode
  );

  const onNodesDisplayModeList = () => {
    set_display_mode(DisplayNodesModeEnum.List);
    save_node_list_params({display_mode: DisplayNodesModeEnum.List});
  }

  const onNodesDisplayModeTiles = () => {
    set_display_mode(DisplayNodesModeEnum.Tiles);
    save_node_list_params({display_mode: DisplayNodesModeEnum.Tiles});
  }

  try {
    if (parent_node.ctype == 'folder') {
      return <Commander
        node_id={parent_node.id}
        pagination={pagination}
        sort={sort}
        nodes={nodes}
        selected_nodes={selected_nodes}
        dragged_nodes={dragged_nodes}
        onSelectNodes={onSelectNodes}
        onDragNodes={onDragNodes}
        display_mode={display_mode}
        onNodeClick={onNodeClick}
        onPageClick={() => {}}
        onPageSizeChange={() => {}}
        onSortChange={onSortChange}
        onMovedNodes={onMovedNodes}
        onNodesDisplayModeList={onNodesDisplayModeList}
        onNodesDisplayModeTiles={onNodesDisplayModeTiles}
        onNodesListChange={onNodesListChange}
        show_dual_button={show_dual_button} />
    } else {
      return <Viewer
        node_id={parent_node.id}
        onNodeClick={onNodeClick}
        show_dual_button={show_dual_button}
        doc={doc}
        doc_versions={doc_versions}
        doc_ver={doc_ver}
        breadcrumb={doc_breadcrumb}
        pages={pages}
        onDocVersionsChange={onDocVersionsChange}
        onDocVerChange={onDocVerChange}
        onPagesChange={onPagesChange}
        onBreadcrumbChange={onDocBreadcrumbChange} />;
    }
  } catch(e) {
    return <div>Caught exception</div>;
  }

}

export default SinglePanel;