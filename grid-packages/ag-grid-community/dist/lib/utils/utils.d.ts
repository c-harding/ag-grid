export declare const _: {
    utf8_encode(s: string): string;
    camelCaseToHyphen(str: string): string;
    hyphenToCamelCase(str: string): string;
    capitalise(str: string): string;
    escapeString(toEscape: string): string;
    camelCaseToHumanText(camelCase: string): string;
    convertToSet<T>(list: T[]): Set<T>;
    sortRowNodesByOrder(rowNodes: import("../main").RowNode[], rowNodeOrder: {
        [id: string]: number;
    }): void;
    traverseNodesWithKey(nodes: import("../main").RowNode[], callback: (node: import("../main").RowNode, key: string) => void): void;
    iterateObject<T_1>(object: {
        [p: string]: T_1;
    } | T_1[], callback: (key: string, value: T_1) => void): void;
    cloneObject<T_2>(object: T_2): T_2;
    deepCloneObject<T_3>(object: T_3): T_3;
    deepCloneDefinition<T_4>(object: T_4, keysToSkip?: string[]): T_4;
    getProperty<T_5, K extends keyof T_5>(object: T_5, key: K): any;
    setProperty<T_6, K_1 extends keyof T_6>(object: T_6, key: K_1, value: any): void;
    copyPropertiesIfPresent<S, T_7 extends S, K_2 extends keyof S>(source: S, target: T_7, ...properties: K_2[]): void;
    copyPropertyIfPresent<S_1, T_8 extends S_1, K_3 extends keyof S_1>(source: S_1, target: T_8, property: K_3, transform?: (value: S_1[K_3]) => any): void;
    getAllKeysInObjects(objects: any[]): string[];
    mergeDeep(dest: any, source: any, copyUndefined?: boolean, objectsThatNeedCopy?: string[], iteration?: number): void;
    assign<T_9, U>(target: T_9, source: U): T_9 & U;
    assign<T_10, U_1, V>(target: T_10, source1: U_1, source2: V): T_10 & U_1 & V;
    assign<T_11, U_2, V_1, W>(target: T_11, source1: U_2, source2: V_1, source3: W): T_11 & U_2 & V_1 & W;
    missingOrEmptyObject(value: any): boolean;
    get(source: any, expression: string, defaultValue: any): any;
    set(target: any, expression: string, value: any): void;
    deepFreeze(object: any): any;
    getValueUsingField(data: any, field: string, fieldContainsDots: boolean): any;
    padStart(value: number, totalStringSize: number): string;
    createArrayOfNumbers(first: number, last: number): number[];
    isNumeric(value: any): boolean;
    getMaxSafeInteger(): number;
    cleanNumber(value: any): number;
    decToHex(number: number, bytes: number): string;
    formatNumberTwoDecimalPlacesAndCommas(value: number): string;
    formatNumberCommas(value: number): string;
    sum(values: number[]): number;
    normalizeWheel(event: any): any;
    isLeftClick(mouseEvent: MouseEvent): boolean;
    areEventsNear(e1: Touch | MouseEvent, e2: Touch | MouseEvent, pixelCount: number): boolean;
    keys<T_12>(map: Map<T_12, any>): T_12[];
    isKeyPressed(event: KeyboardEvent, keyToCheck: number): boolean;
    isCharacterKey(event: KeyboardEvent): boolean;
    isEventFromPrintableCharacter(event: KeyboardEvent): boolean;
    isUserSuppressingKeyboardEvent(gridOptionsWrapper: import("../gridOptionsWrapper").GridOptionsWrapper, keyboardEvent: KeyboardEvent, rowNode: import("../main").RowNode, column: import("../main").Column, editing: boolean): boolean;
    createIcon(iconName: string, gridOptionsWrapper: import("../gridOptionsWrapper").GridOptionsWrapper, column: import("../main").Column): HTMLElement;
    createIconNoSpan(iconName: string, gridOptionsWrapper: import("../gridOptionsWrapper").GridOptionsWrapper, column?: import("../main").Column, forceCreate?: boolean): HTMLElement;
    iconNameClassMap: {
        [key: string]: string;
    };
    makeNull<T_13>(value?: T_13): T_13;
    exists<T_14>(value: T_14, allowEmptyString?: boolean): boolean;
    missing<T_15>(value: T_15): boolean;
    missingOrEmpty<T_16>(value?: string | T_16[]): boolean;
    toStringOrNull(value: any): string;
    attrToNumber(value: string | number): number;
    attrToBoolean(value: string | boolean): boolean;
    attrToString(value: string): string;
    referenceCompare<T_17>(left: T_17, right: T_17): boolean;
    jsonEquals<T1, T2>(val1: T1, val2: T2): boolean;
    defaultComparator(valueA: any, valueB: any, accentedCompare?: boolean): number;
    find<T_18>(collection: {
        [id: string]: T_18;
    } | T_18[], predicate: string | boolean | ((item: T_18) => boolean), value?: any): T_18;
    values<T_19>(object: {
        [key: string]: T_19;
    } | Set<T_19> | Map<any, T_19>): T_19[];
    fuzzyCheckStrings(inputValues: string[], validValues: string[], allSuggestions: string[]): {
        [p: string]: string[];
    };
    fuzzySuggestions(inputValue: string, allSuggestions: string[], hideIrrelevant?: boolean, weighted?: true): string[];
    get_bigrams(from: string): any[];
    string_distances(str1: string, str2: string): number;
    string_weighted_distances(str1: string, str2: string): number;
    doOnce(func: () => void, key: string): void;
    getFunctionName(funcConstructor: any): any;
    getFunctionParameters(func: any): any;
    isFunction(val: any): boolean;
    executeInAWhile(funcs: Function[]): void;
    executeNextVMTurn(funcs: Function[]): void;
    executeAfter(funcs: Function[], milliseconds?: number): void;
    debounce(func: (...args: any[]) => void, wait: number, immediate?: boolean): (...args: any[]) => void;
    compose(...fns: Function[]): (arg: any) => any;
    callIfPresent(func: Function): void;
    stopPropagationForAgGrid(event: Event): void;
    isStopPropagationForAgGrid(event: Event): boolean;
    getCellCompForEvent(gridOptionsWrapper: import("../gridOptionsWrapper").GridOptionsWrapper, event: Event): import("../main").CellComp;
    addChangeListener(element: HTMLElement, listener: EventListener): void;
    getTarget(event: Event): Element;
    isElementInEventPath(element: HTMLElement, event: Event): boolean;
    createEventPath(event: Event): EventTarget[];
    addAgGridEventPath(event: Event): void;
    getEventPath(event: Event): EventTarget[];
    addSafePassiveEventListener(frameworkOverrides: import("../main").IFrameworkOverrides, eElement: HTMLElement, event: string, listener: (event?: any) => void): void;
    isEventSupported: (eventName: any) => boolean;
    addCssClass(element: HTMLElement, className: string): HTMLElement;
    removeCssClass(element: HTMLElement, className: string): void;
    addOrRemoveCssClass(element: HTMLElement, className: string, addOrRemove: boolean): void;
    radioCssClass(element: HTMLElement, elementClass: string, otherElementClass?: string): void;
    containsClass(element: HTMLElement, className: string): boolean;
    setDisplayed(element: HTMLElement, displayed: boolean): void;
    setVisible(element: HTMLElement, visible: boolean): void;
    setDisabled(element: HTMLElement, disabled: boolean): void;
    isElementChildOfClass(element: HTMLElement, cls: string, maxNest?: number): boolean;
    getElementSize(el: HTMLElement): {
        height: number;
        width: number;
        paddingTop: number;
        paddingRight: number;
        paddingBottom: number;
        paddingLeft: number;
        marginTop: number;
        marginRight: number;
        marginBottom: number;
        marginLeft: number;
        boxSizing: string;
    };
    getInnerHeight(el: HTMLElement): number;
    getInnerWidth(el: HTMLElement): number;
    getAbsoluteHeight(el: HTMLElement): number;
    getAbsoluteWidth(el: HTMLElement): number;
    isRtlNegativeScroll(): boolean;
    getScrollLeft(element: HTMLElement, rtl: boolean): number;
    setScrollLeft(element: HTMLElement, value: number, rtl: boolean): void;
    clearElement(el: HTMLElement): void;
    removeElement(parent: HTMLElement, cssSelector: string): void;
    removeFromParent(node: Element): void;
    isVisible(element: HTMLElement): boolean;
    loadTemplate(template: string): HTMLElement;
    appendHtml(eContainer: HTMLElement, htmlTemplate: string): void;
    getElementAttribute(element: any, attributeName: string): string;
    offsetHeight(element: HTMLElement): number;
    offsetWidth(element: HTMLElement): number;
    ensureDomOrder(eContainer: HTMLElement, eChild: HTMLElement, eChildBefore: HTMLElement): void;
    setDomChildOrder(eContainer: HTMLElement, orderedChildren: HTMLElement[]): void;
    insertTemplateWithDomOrder(eContainer: HTMLElement, htmlTemplate: string, eChildBefore: HTMLElement): HTMLElement;
    prependDC(parent: HTMLElement, documentFragment: DocumentFragment): void;
    addStylesToElement(eElement: any, styles: any): void;
    isHorizontalScrollShowing(element: HTMLElement): boolean;
    isVerticalScrollShowing(element: HTMLElement): boolean;
    setElementWidth(element: HTMLElement, width: string | number): void;
    setFixedWidth(element: HTMLElement, width: string | number): void;
    setElementHeight(element: HTMLElement, height: string | number): void;
    setFixedHeight(element: HTMLElement, height: string | number): void;
    formatSize(size: string | number): string;
    isNode(o: any): boolean;
    isElement(o: any): boolean;
    isNodeOrElement(o: any): boolean;
    copyNodeList(nodeList: NodeList): Node[];
    iterateNamedNodeMap(map: NamedNodeMap, callback: (key: string, value: string) => void): void;
    setCheckboxState(eCheckbox: HTMLInputElement, state: any): void;
    addOrRemoveAttribute(element: HTMLElement, name: string, value: any): void;
    nodeListForEach<T_20 extends Node>(nodeList: NodeListOf<T_20>, action: (value: T_20) => void): void;
    serialiseDate(date: Date, includeTime?: boolean, separator?: string): string;
    parseDateTimeFromString(value: string): Date;
    stringToArray(strData: string, delimiter?: string): string[][];
    isBrowserIE(): boolean;
    isBrowserEdge(): boolean;
    isBrowserSafari(): boolean;
    isBrowserChrome(): boolean;
    isBrowserFirefox(): boolean;
    isIOSUserAgent(): boolean;
    getTabIndex(el: HTMLElement): string;
    getMaxDivHeight(): number;
    getScrollbarWidth(): number;
    hasOverflowScrolling(): boolean;
    getBodyWidth(): number;
    getBodyHeight(): number;
    firstExistingValue<A>(...values: A[]): A;
    anyExists(values: any[]): boolean;
    existsAndNotEmpty<T_21>(value?: T_21[]): boolean;
    last<T_22>(arr: T_22[]): T_22;
    areEqual<T_23>(a: T_23[], b: T_23[], comparator?: (a: T_23, b: T_23) => boolean): boolean;
    compareArrays(array1?: any[], array2?: any[]): boolean;
    shallowCompare(arr1: any[], arr2: any[]): boolean;
    sortNumerically(array: number[]): number[];
    removeRepeatsFromArray<T_24>(array: T_24[], object: T_24): void;
    removeFromArray<T_25>(array: T_25[], object: T_25): void;
    removeAllFromArray<T_26>(array: T_26[], toRemove: T_26[]): void;
    insertIntoArray<T_27>(array: T_27[], object: T_27, toIndex: number): void;
    insertArrayIntoArray<T_28>(dest: T_28[], src: T_28[], toIndex: number): void;
    moveInArray<T_29>(array: T_29[], objectsToMove: T_29[], toIndex: number): void;
    includes<T_30>(array: T_30[], value: T_30): boolean;
    flatten(arrayOfArrays: any[]): any[];
    pushAll<T_31>(target: T_31[], source: T_31[]): void;
    toStrings<T_32>(array: T_32[]): string[];
    findIndex<T_33>(collection: T_33[], predicate: (item: T_33, idx: number, collection: T_33[]) => boolean): number;
    every<T_34>(list: T_34[], predicate: (value: T_34, index: number) => boolean): boolean;
    some<T_35>(list: T_35[], predicate: (value: T_35, index: number) => boolean): boolean;
    forEach<T_36>(list: T_36[], action: (value: T_36, index: number) => void): void;
    forEachReverse<T_37>(list: T_37[], action: (value: T_37, index: number) => void): void;
    map<T_38, V_2>(list: T_38[], process: (value: T_38, index: number) => V_2): V_2[];
    filter<T_39>(list: T_39[], predicate: (value: T_39, index: number) => boolean): T_39[];
    reduce<T_40, V_3>(list: T_40[], step: (acc: V_3, value: T_40, index: number) => V_3, initial: V_3): V_3;
    forEachSnapshotFirst<T_41>(list: T_41[], callback: (item: T_41) => void): void;
    getAriaSortState(column: import("../main").Column): "none" | "ascending" | "descending";
    getAriaLevel(element: HTMLElement): number;
    getAriaPosInSet(element: HTMLElement): number;
    setAriaLabel(element: HTMLElement, label: string): void;
    setAriaLabelledBy(element: HTMLElement, labelledBy: string): void;
    setAriaDescribedBy(element: HTMLElement, describedby: string): void;
    setAriaLevel(element: HTMLElement, level: number): void;
    setAriaDisabled(element: HTMLElement, disabled: boolean): void;
    setAriaExpanded(element: HTMLElement, expanded: boolean): void;
    removeAriaExpanded(element: HTMLElement): void;
    setAriaSetSize(element: HTMLElement, setsize: number): void;
    setAriaPosInSet(element: HTMLElement, position: number): void;
    setAriaMultiSelectable(element: HTMLElement, multiSelectable: boolean): void;
    setAriaRowCount(element: HTMLElement, rowCount: number): void;
    setAriaRowIndex(element: HTMLElement, rowIndex: number): void;
    setAriaColCount(element: HTMLElement, colCount: number): void;
    setAriaColIndex(element: HTMLElement, colIndex: number): void;
    setAriaColSpan(element: HTMLElement, colSpan: number): void;
    setAriaSort(element: HTMLElement, sort: "none" | "ascending" | "descending"): void;
    removeAriaSort(element: HTMLElement): void;
    setAriaSelected(element: HTMLElement, selected: boolean): void;
    setAriaChecked(element: HTMLElement, checked?: boolean): void;
    getNameOfClass(theClass: any): string;
    findLineByLeastSquares(values: number[]): any[];
    cssStyleObjectToMarkup(stylesToUse: any): string;
    message(msg: string): void;
    bindCellRendererToHtmlElement(cellRendererPromise: import("./promise").Promise<import("../main").ICellRendererComp>, eTarget: HTMLElement): void;
};
