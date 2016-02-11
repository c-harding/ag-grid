
import {GridOptions} from "./entities/gridOptions";
import GridOptionsWrapper from "./gridOptionsWrapper";
import InMemoryRowController from "./rowControllers/inMemoryRowController";
import PaginationController from "./rowControllers/paginationController";
import VirtualPageRowController from "./rowControllers/virtualPageRowController";
import FloatingRowModel from "./rowControllers/floatingRowModel";
import SelectionController from "./selectionController";
import {ColumnController} from "./columnController/columnController";
import RowRenderer from "./rendering/rowRenderer";
import HeaderRenderer from "./headerRendering/headerRenderer";
import FilterManager from "./filter/filterManager";
import ValueService from "./valueService";
import MasterSlaveService from "./masterSlaveService";
import EventService from "./eventService";
import DragAndDropService from "./dragAndDrop/dragAndDropService";
import GridPanel from "./gridPanel/gridPanel";
import {Logger} from "./logger";
import {GridApi} from "./gridApi";
import Constants from "./constants";
import HeaderTemplateLoader from "./headerRendering/headerTemplateLoader";
import BalancedColumnTreeBuilder from "./columnController/balancedColumnTreeBuilder";
import DisplayedGroupCreator from "./columnController/displayedGroupCreator";
import SelectionRendererFactory from "./selectionRendererFactory";
import ExpressionService from "./expressionService";
import TemplateService from "./templateService";
import PopupService from "./widgets/agPopupService";
import GroupCreator from "./groupCreator";
import {LoggerFactory} from "./logger";
import ColumnUtils from "./columnController/columnUtils";
import AutoWidthCalculator from "./rendering/autoWidthCalculator";
import {Events} from "./events";
import ToolPanel from "./toolPanel/toolPanel";
import BorderLayout from "./layout/borderLayout";
import ColumnChangeEvent from "./columnChangeEvent";
import Column from "./entities/column";
import {RowNode} from "./entities/rowNode";
import {ColDef} from "./entities/colDef";
import {DragService} from "./headerRendering/dragService";
import {Context} from './context/context';
import {Bean} from "./context/context";
import {Qualifier} from "./context/context";

@Bean('gridCore')
export class GridCore {

    @Qualifier('gridOptions') private gridOptions: GridOptions;
    @Qualifier('gridOptionsWrapper') private gridOptionsWrapper: GridOptionsWrapper;
    @Qualifier('inMemoryRowController') private inMemoryRowController: InMemoryRowController;
    @Qualifier('paginationController') private paginationController: PaginationController;
    @Qualifier('virtualPageRowController') private virtualPageRowController: VirtualPageRowController;

    @Qualifier('selectionController') private selectionController: SelectionController;
    @Qualifier('columnController') private columnController: ColumnController;
    @Qualifier('rowRenderer') private rowRenderer: RowRenderer;
    @Qualifier('headerRenderer') private headerRenderer: HeaderRenderer;
    @Qualifier('filterManager') private filterManager: FilterManager;
    @Qualifier('eventService') private eventService: EventService;
    @Qualifier('toolPanel') private toolPanel: any;
    @Qualifier('gridPanel') private gridPanel: GridPanel;

    @Qualifier('eGridDiv') private eGridDiv: HTMLElement;
    @Qualifier('$scope') private $scope: any;
    @Qualifier('quickFilterOnScope') private quickFilterOnScope: string;
    @Qualifier('popupService') private popupService: PopupService;

    private finished: boolean;
    private doingVirtualPaging: boolean;

    private eRootPanel: any;
    private toolPanelShowing: boolean;
    private doingPagination: boolean;
    private usingInMemoryModel: boolean;
    private rowModel: any;

    private windowResizeListener: EventListener;
    private logger: Logger;

    constructor(@Qualifier('loggerFactory') loggerFactory: LoggerFactory) {
        this.logger = loggerFactory.create('GridCore');
        this.usingInMemoryModel = true;
    }

    public agPostInit(): void {
        // this is a child bean, get a reference and pass it on
        // CAN WE DELETE THIS? it's done in the setDatasource section
        this.setRowModel(this.inMemoryRowController.getModel());

        // and the last bean, done in it's own section, as it's optional
        var paginationGui: any;
        var toolPanelLayout: any;
        if (!this.gridOptionsWrapper.isForPrint()) {
            paginationGui = this.paginationController.getGui();
            toolPanelLayout = this.toolPanel.layout;
        }

        this.eRootPanel = new BorderLayout({
            center: this.gridPanel.getLayout(),
            east: toolPanelLayout,
            south: paginationGui,
            dontFill: this.gridOptionsWrapper.isForPrint(),
            name: 'eRootPanel'
        });

        // default is we don't show paging panel, this is set to true when datasource is set
        this.eRootPanel.setSouthVisible(false);

        // see what the grid options are for default of toolbar
        this.showToolPanel(this.gridOptionsWrapper.isShowToolPanel());

        this.eGridDiv.appendChild(this.eRootPanel.getGui());
        this.logger.log('grid DOM added');

        this.eventService.addEventListener(Events.EVENT_COLUMN_EVERYTHING_CHANGED, this.onColumnChanged.bind(this));
        this.eventService.addEventListener(Events.EVENT_COLUMN_GROUP_OPENED, this.onColumnChanged.bind(this));
        this.eventService.addEventListener(Events.EVENT_COLUMN_MOVED, this.onColumnChanged.bind(this));
        this.eventService.addEventListener(Events.EVENT_COLUMN_ROW_GROUP_CHANGE, this.onColumnChanged.bind(this));
        this.eventService.addEventListener(Events.EVENT_COLUMN_RESIZED, this.onColumnChanged.bind(this));
        this.eventService.addEventListener(Events.EVENT_COLUMN_VALUE_CHANGE, this.onColumnChanged.bind(this));
        this.eventService.addEventListener(Events.EVENT_COLUMN_VISIBLE, this.onColumnChanged.bind(this));
        this.eventService.addEventListener(Events.EVENT_COLUMN_PINNED, this.onColumnChanged.bind(this));

        // if using angular, watch for quickFilter changes
        if (this.$scope) {
            this.$scope.$watch(this.quickFilterOnScope, (newFilter: any) => this.onQuickFilterChanged(newFilter) );
        }

        if (!this.gridOptionsWrapper.isForPrint()) {
            this.addWindowResizeListener();
        }

        this.inMemoryRowController.setAllRows(this.gridOptionsWrapper.getRowData());
        this.setupColumns();
        this.updateModelAndRefresh(Constants.STEP_EVERYTHING);

        this.decideStartingOverlay();

        // if datasource provided, use it
        if (this.gridOptionsWrapper.getDatasource()) {
            this.setDatasource();
        }

        this.doLayout();

        this.finished = false;
        this.periodicallyDoLayout();

        this.popupService.setPopupParent(this.eRootPanel.getGui());

        this.logger.log('initialised');
    }

    public agInitComplete(): void {
        var readyEvent = {
            api: this.gridOptions.api,
            columnApi: this.gridOptions.columnApi
        };
        this.eventService.dispatchEvent(Events.EVENT_GRID_READY, readyEvent);
    }

    private decideStartingOverlay() {
        // if not virtual paging, then we might need to show an overlay if no data
        var notDoingVirtualPaging = !this.gridOptionsWrapper.isVirtualPaging();
        if (notDoingVirtualPaging) {
            var showLoading = !this.gridOptionsWrapper.getRowData();
            var showNoData = this.gridOptionsWrapper.getRowData() && this.gridOptionsWrapper.getRowData().length == 0;
            if (showLoading) {
                this.showLoadingOverlay();
            }
            if (showNoData) {
                this.showNoRowsOverlay();
            }
        }
    }

    private addWindowResizeListener(): void {
        var that = this;
        // putting this into a function, so when we remove the function,
        // we are sure we are removing the exact same function (i'm not
        // sure what 'bind' does to the function reference, if it's safe
        // the result from 'bind').
        this.windowResizeListener = function resizeListener() {
            that.doLayout();
        };
        window.addEventListener('resize', this.windowResizeListener);
    }

    public getRowModel(): any {
        return this.rowModel;
    }

    private periodicallyDoLayout() {
        if (!this.finished) {
            var that = this;
            setTimeout(function () {
                that.doLayout();
                that.gridPanel.periodicallyCheck();
                that.periodicallyDoLayout();
            }, 500);
        }
    }

    private onColumnChanged(event: ColumnChangeEvent): void {
        if (event.isRowGroupChanged()) {
            this.inMemoryRowController.onRowGroupChanged();
        }
        if (event.isValueChanged()) {
            this.inMemoryRowController.doAggregate();
        }

        if (event.isIndividualColumnResized()) {
            this.onIndividualColumnResized(event.getColumn());
        } else if (event.getType()===Events.EVENT_COLUMN_MOVED) {
            this.refreshHeader();
        } else {
            this.refreshHeaderAndBody();
        }

        this.gridPanel.showPinnedColContainersIfNeeded();
    }

    public refreshRowGroup(): void {
        this.inMemoryRowController.onRowGroupChanged();
        this.refreshHeaderAndBody();
    }

    private onIndividualColumnResized(column: Column): void {
        this.headerRenderer.onIndividualColumnResized(column);
        //this.rowRenderer.onIndividualColumnResized(column);
        if (column.isPinned()) {
            this.updatePinnedColContainerWidthAfterColResize();
        } else {
            this.updateBodyContainerWidthAfterColResize();
        }
    }

    public showToolPanel(show: any) {
        if (!this.toolPanel) {
            this.toolPanelShowing = false;
            return;
        }

        this.toolPanelShowing = show;
        this.eRootPanel.setEastVisible(show);
    }

    public isToolPanelShowing() {
        return this.toolPanelShowing;
    }

    public isUsingInMemoryModel(): boolean {
        return this.usingInMemoryModel;
    }

    public setDatasource(datasource?: any) {
        // if datasource provided, then set it
        if (datasource) {
            this.gridOptions.datasource = datasource;
        }
        // get the set datasource (if null was passed to this method,
        // then need to get the actual datasource from options
        var datasourceToUse = this.gridOptionsWrapper.getDatasource();
        this.doingVirtualPaging = this.gridOptionsWrapper.isVirtualPaging() && datasourceToUse;
        this.doingPagination = datasourceToUse && !this.doingVirtualPaging;
        var showPagingPanel: any;

        if (this.doingVirtualPaging) {
            this.paginationController.setDatasource(null);
            this.virtualPageRowController.setDatasource(datasourceToUse);
            this.setRowModel(this.virtualPageRowController.getModel());
            this.usingInMemoryModel = false;
            showPagingPanel = false;
        } else if (this.doingPagination) {
            this.paginationController.setDatasource(datasourceToUse);
            this.virtualPageRowController.setDatasource(null);
            this.setRowModel(this.inMemoryRowController.getModel());
            this.usingInMemoryModel = true;
            showPagingPanel = true;
        } else {
            this.paginationController.setDatasource(null);
            this.virtualPageRowController.setDatasource(null);
            this.setRowModel(this.inMemoryRowController.getModel());
            this.usingInMemoryModel = true;
            showPagingPanel = false;
        }

        this.eRootPanel.setSouthVisible(showPagingPanel);

        // because we just set the rowModel, need to update the gui
        this.rowRenderer.refreshView();

        this.doLayout();
    }

    private setRowModel(rowModel: any): void {
        this.rowModel = rowModel;
        this.selectionController.setRowModel(rowModel);
        this.filterManager.setRowModel(rowModel);
        this.rowRenderer.setRowModel(rowModel);
        this.gridPanel.setRowModel(rowModel);
    }

    // gets called after columns are shown / hidden from groups expanding
    private refreshHeaderAndBody() {
        this.logger.log('refreshHeaderAndBody');
        this.refreshHeader();
        this.refreshBody();
    }

    private refreshHeader() {
        this.headerRenderer.refreshHeader();
        this.headerRenderer.updateFilterIcons();
        this.headerRenderer.updateSortIcons();
        this.headerRenderer.setPinnedColContainerWidth();
    }

    private refreshBody() {
        this.gridPanel.setBodyContainerWidth();
        this.gridPanel.setPinnedColContainerWidth();
        this.rowRenderer.refreshView();
    }

    public agDestroy() {
        if (this.windowResizeListener) {
            window.removeEventListener('resize', this.windowResizeListener);
            this.logger.log('Removing windowResizeListener');
        }
        this.finished = true;

        this.eGridDiv.removeChild(this.eRootPanel.getGui());
        this.logger.log('Grid DOM removed');
    }

    public onQuickFilterChanged(newFilter: any) {
        var actuallyChanged = this.filterManager.setQuickFilter(newFilter);
        if (actuallyChanged) {
            this.onFilterChanged();
        }
    }

    public onFilterModified() {
        this.eventService.dispatchEvent(Events.EVENT_FILTER_MODIFIED);
    }

    public onFilterChanged() {
        this.eventService.dispatchEvent(Events.EVENT_BEFORE_FILTER_CHANGED);
        this.filterManager.onFilterChanged();
        this.headerRenderer.updateFilterIcons();
        if (this.gridOptionsWrapper.isEnableServerSideFilter()) {
            // if doing server side filtering, changing the sort has the impact
            // of resetting the datasource
            this.setDatasource();
        } else {
            // if doing in memory filtering, we just update the in memory data
            this.updateModelAndRefresh(Constants.STEP_FILTER);
        }
        this.eventService.dispatchEvent(Events.EVENT_AFTER_FILTER_CHANGED);
    }

    public onRowClicked(multiSelectKeyPressed: boolean, rowIndex: number, node: RowNode) {

        // we do not allow selecting groups by clicking (as the click here expands the group)
        // so return if it's a group row
        if (node.group) {
            return;
        }

        // we also don't allow selection of floating rows
        if (node.floating) {
            return;
        }

        // making local variables to make the below more readable
        var gridOptionsWrapper = this.gridOptionsWrapper;
        var selectionController = this.selectionController;

        // if no selection method enabled, do nothing
        if (!gridOptionsWrapper.isRowSelection()) {
            return;
        }

        // if click selection suppressed, do nothing
        if (gridOptionsWrapper.isSuppressRowClickSelection()) {
            return;
        }

        var doDeselect = multiSelectKeyPressed
            && selectionController.isNodeSelected(node)
            && gridOptionsWrapper.isRowDeselection();

        if (doDeselect) {
            selectionController.deselectNode(node);
        } else {
            selectionController.selectNode(node, multiSelectKeyPressed);
        }
    }

    public showLoadingOverlay(): void {
        this.gridPanel.showLoadingOverlay();
    }

    public showNoRowsOverlay(): void {
        this.gridPanel.showNoRowsOverlay();
    }

    public hideOverlay(): void {
        this.gridPanel.hideOverlay();
    }

    private setupColumns() {
        this.columnController.onColumnsChanged();
        this.gridPanel.showPinnedColContainersIfNeeded();
        this.gridPanel.onBodyHeightChange();
    }

    // rowsToRefresh is at what index to start refreshing the rows. the assumption is
    // if we are expanding or collapsing a group, then only he rows below the group
    // need to be refresh. this allows the context (eg focus) of the other cells to
    // remain.
    public updateModelAndRefresh(step: any, refreshFromIndex?: any) {
        this.inMemoryRowController.updateModel(step);
        this.rowRenderer.refreshView(refreshFromIndex);
    }

    public setRowData(rows?: any, firstId?: any) {
        if (rows) {
            this.gridOptions.rowData = rows;
        }
        var rowData = this.gridOptionsWrapper.getRowData();
        this.inMemoryRowController.setAllRows(rowData, firstId);
        this.selectionController.deselectAll();
        this.filterManager.onNewRowsLoaded();
        this.updateModelAndRefresh(Constants.STEP_EVERYTHING);
        this.headerRenderer.updateFilterIcons();
        if (rowData && rowData.length > 0) {
            this.hideOverlay();
        } else {
            this.showNoRowsOverlay();
        }
    }

    public ensureNodeVisible(comparator: any) {
        if (this.doingVirtualPaging) {
            throw 'Cannot use ensureNodeVisible when doing virtual paging, as we cannot check rows that are not in memory';
        }
        // look for the node index we want to display
        var rowCount = this.rowModel.getVirtualRowCount();
        var comparatorIsAFunction = typeof comparator === 'function';
        var indexToSelect = -1;
        // go through all the nodes, find the one we want to show
        for (var i = 0; i < rowCount; i++) {
            var node = this.rowModel.getVirtualRow(i);
            if (comparatorIsAFunction) {
                if (comparator(node)) {
                    indexToSelect = i;
                    break;
                }
            } else {
                // check object equality against node and data
                if (comparator === node || comparator === node.data) {
                    indexToSelect = i;
                    break;
                }
            }
        }
        if (indexToSelect >= 0) {
            this.gridPanel.ensureIndexVisible(indexToSelect);
        }
    }

    public getFilterModel() {
        return this.filterManager.getFilterModel();
    }

    public setFocusedCell(rowIndex: number, colKey: string|ColDef|Column) {
        this.gridPanel.ensureIndexVisible(rowIndex);
        this.gridPanel.ensureColumnVisible(colKey);
        var that = this;
        setTimeout(function () {
            that.rowRenderer.setFocusedCell(rowIndex, colKey);
        }, 10);
    }

    public getSortModel() {
        return this.columnController.getSortModel();
    }

    public setSortModel(sortModel: any) {
        this.columnController.setSortModel(sortModel);
        this.onSortingChanged();
    }

    public onSortingChanged() {
        this.eventService.dispatchEvent(Events.EVENT_BEFORE_SORT_CHANGED);
        this.headerRenderer.updateSortIcons();
        if (this.gridOptionsWrapper.isEnableServerSideSorting()) {
            // if doing server side sorting, changing the sort has the impact
            // of resetting the datasource
            this.setDatasource();
        } else {
            // if doing in memory sorting, we just update the in memory data
            this.updateModelAndRefresh(Constants.STEP_SORT);
        }
        this.eventService.dispatchEvent(Events.EVENT_AFTER_SORT_CHANGED);
    }

    public setColumnDefs(colDefs?: ColDef[]) {
        if (colDefs) {
            this.gridOptions.columnDefs = colDefs;
        }
        this.setupColumns();
        this.updateModelAndRefresh(Constants.STEP_EVERYTHING);
        // found that adding pinned column can upset the layout
        this.doLayout();
    }

    public updateBodyContainerWidthAfterColResize() {
        this.rowRenderer.setMainRowWidths();
        this.gridPanel.setBodyContainerWidth();
    }

    public updatePinnedColContainerWidthAfterColResize() {
        this.gridPanel.setPinnedColContainerWidth();
        this.headerRenderer.setPinnedColContainerWidth();
    }

    public doLayout() {
        // need to do layout first, as drawVirtualRows and setPinnedColHeight
        // need to know the result of the resizing of the panels.
        var sizeChanged = this.eRootPanel.doLayout();
        // both of the two below should be done in gridPanel, the gridPanel should register 'resize' to the panel
        if (sizeChanged) {
            this.rowRenderer.drawVirtualRows();
            var event = {
                clientWidth: this.eRootPanel.getGui().clientWidth,
                clientHeight: this.eRootPanel.getGui().clientHeight
            };
            this.eventService.dispatchEvent(Events.EVENT_GRID_SIZE_CHANGED, event);
        }
    }
}
