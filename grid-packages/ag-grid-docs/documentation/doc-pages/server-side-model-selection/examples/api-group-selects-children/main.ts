import { Grid, GridOptions, GetRowIdParams, FirstDataRenderedEvent, IsServerSideGroupOpenByDefaultParams, IServerSideDatasource, IServerSideGroupSelectionState } from '@ag-grid-community/core'
declare var FakeServer: any;
const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: [
    { field: 'country', enableRowGroup: true, rowGroup: true, hide: true },
    { field: 'year', enableRowGroup: true, rowGroup: true, hide: true },
    { field: 'athlete', hide: true },
    { field: 'sport', enableRowGroup: true, checkboxSelection: true, filter: 'agTextColumnFilter' },
    { field: 'gold', aggFunc: 'sum', filter: 'agNumberColumnFilter' },
    { field: 'silver', aggFunc: 'sum', filter: 'agNumberColumnFilter' },
    { field: 'bronze', aggFunc: 'sum', filter: 'agNumberColumnFilter' },
  ],
  defaultColDef: {
    floatingFilter: true,
    flex: 1,
    minWidth: 120,
    resizable: true,
    sortable: true,
  },
  getRowId: (params: GetRowIdParams) => {
    if (params.data.id != null) {
      return 'leaf-' + params.data.id;
    }
    const rowGroupCols = params.columnApi.getRowGroupColumns();
    const rowGroupColIds = rowGroupCols.map(col => col.getId()).join('-');
    const thisGroupCol = rowGroupCols[params.level];
    return 'group-' + rowGroupColIds + '-' + (params.parentKeys || []).join('-') + params.data[thisGroupCol.getColDef().field!];
  },
  isServerSideGroupOpenByDefault: (params: IsServerSideGroupOpenByDefaultParams) => {
    return params.rowNode.key === 'United States' || String(params.rowNode.key) === '2004';
  },
  onFirstDataRendered: (params: FirstDataRenderedEvent) => {
    params.api.setServerSideSelectionState({
      selectAllChildren: true,
      toggledNodes: [{
        nodeId: 'United States',
        selectAllChildren: false,
        toggledNodes: [{
            nodeId: 'United States2004',
            selectAllChildren: true,
        }],
      }],
    });
  },
  autoGroupColumnDef: {
    headerCheckboxSelection: true,
    field: 'athlete',
    flex: 1,
    minWidth: 240,
    cellRendererParams: {
      checkbox: true,
    },
  },

  // use the server-side row model
  rowModelType: 'serverSide',

  // allow multiple row selections
  rowSelection: 'multiple',
  rowGroupPanelShow: 'always',

  // restrict row selections via checkbox selection
  suppressRowClickSelection: true,

  groupSelectsChildren: true,

  animateRows: true,
  suppressAggFuncInHeader: true,
  serverSideFilterAllLevels: true,
}

let selectionState: IServerSideGroupSelectionState = {
  selectAllChildren: false,
  toggledNodes: [],
};

function saveSelectionState() {
  selectionState = (gridOptions.api!.getServerSideSelectionState() as IServerSideGroupSelectionState);
  console.log(JSON.stringify(selectionState, null, 2));
}

function loadSelectionState() {
  gridOptions.api!.setServerSideSelectionState(selectionState);
}

function clearSelectionState() {
  gridOptions.api!.setServerSideSelectionState({
    selectAllChildren: false,
    toggledNodes: [],
  });
}

function getServerSideDatasource(server: any): IServerSideDatasource {
  return {
    getRows: (params) => {
      console.log('[Datasource] - rows requested by grid: ', params.request)

      var response = server.getData(params.request)

      // adding delay to simulate real server call
      setTimeout(function () {
        if (response.success) {
          // call the success callback
          params.success({ rowData: response.rows, rowCount: response.lastRow })
        } else {
          // inform the grid request failed
          params.fail()
        }
      }, 200)
    },
  }
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
  var gridDiv = document.querySelector<HTMLElement>('#myGrid')!
  new Grid(gridDiv, gridOptions)

  fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
    .then(response => response.json())
    .then(function (data) {
      // assign a unique ID to each data item
      data.forEach(function (item: any, index: number) {
        item.id = index;
      });

      // setup the fake server with entire dataset
      var fakeServer = new FakeServer(data)

      // create datasource with a reference to the fake server
      var datasource = getServerSideDatasource(fakeServer)

      // register the datasource with the grid
      gridOptions.api!.setServerSideDatasource(datasource)
    })
})
