import { IAgLabel } from './agAbstractLabel';
import { AgAbstractField, FieldElement } from './agAbstractField';
export interface IInputField extends IAgLabel {
    value?: any;
    width?: number;
}
export declare abstract class AgAbstractInputField<TElement extends FieldElement, TValue, TConfig extends IInputField = IInputField> extends AgAbstractField<TValue, TConfig> {
    private readonly inputType?;
    protected readonly eLabel: HTMLElement;
    protected readonly eWrapper: HTMLElement;
    protected readonly eInput: TElement;
    constructor(className: string, displayFieldTag?: string, inputType?: string, config?: TConfig);
    protected postConstruct(): void;
    protected refreshLabel(): void;
    protected addInputListeners(): void;
    private setInputType;
    getInputElement(): TElement;
    setInputWidth(width: number | 'flex'): this;
    setInputName(name: string): this;
    getFocusableElement(): HTMLElement;
    setMaxLength(length: number): this;
    setInputPlaceholder(placeholder: string): this;
    setInputAriaLabel(label: string): this;
    setDisabled(disabled: boolean): this;
}
