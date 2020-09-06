import { Component } from "@ag-grid-community/core";
import { ChartController } from "../../chartController";
export declare class ChartDataPanel extends Component {
    static TEMPLATE: string;
    private dragAndDropService;
    private gridOptionsWrapper;
    private chartTranslator;
    private categoriesGroupComp?;
    private seriesGroupComp?;
    private columnComps;
    private chartType?;
    private insertIndex?;
    private readonly chartController;
    constructor(chartController: ChartController);
    init(): void;
    protected destroy(): void;
    private updatePanels;
    private addComponent;
    private addChangeListener;
    private createCategoriesGroupComponent;
    private createSeriesGroupComponent;
    private addDragHandle;
    private generateGetSeriesLabel;
    private getCategoryGroupTitle;
    private getSeriesGroupTitle;
    private isInPairedMode;
    private clearComponents;
    private onDragging;
    private checkInsertIndex;
    private isInterestedIn;
}
