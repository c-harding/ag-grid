import { Shape } from "./shape";
import { BBox } from "../bbox";
export declare type FontStyle = 'normal' | 'italic' | 'oblique';
export declare type FontWeight = 'normal' | 'bold' | 'bolder' | 'lighter' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
export declare class Text extends Shape {
    static className: string;
    protected static defaultStyles: {
        fill: string;
        stroke: undefined;
        strokeWidth: number;
        lineDash: undefined;
        lineDashOffset: number;
        lineCap: import("./shape").ShapeLineCap;
        lineJoin: import("./shape").ShapeLineJoin;
        opacity: number;
        fillShadow: undefined;
        strokeShadow: undefined;
    } & {
        textAlign: CanvasTextAlign;
        fontStyle: undefined;
        fontWeight: undefined;
        fontSize: number;
        fontFamily: string;
        textBaseline: CanvasTextBaseline;
    };
    private _x;
    x: number;
    private _y;
    y: number;
    private lineBreakRegex;
    private lines;
    private splitText;
    private _text;
    text: string;
    private _font?;
    readonly font: string;
    private _dirtyFont;
    dirtyFont: boolean;
    private _fontStyle?;
    fontStyle: FontStyle | undefined;
    private _fontWeight?;
    fontWeight: FontWeight | undefined;
    private _fontSize;
    fontSize: number;
    private _fontFamily;
    fontFamily: string;
    private _textAlign;
    textAlign: CanvasTextAlign;
    private _textBaseline;
    textBaseline: CanvasTextBaseline;
    private _lineHeight;
    lineHeight: number;
    computeBBox(): BBox | undefined;
    private getPreciseBBox;
    private getApproximateBBox;
    isPointInPath(x: number, y: number): boolean;
    isPointInStroke(x: number, y: number): boolean;
    render(ctx: CanvasRenderingContext2D): void;
}
