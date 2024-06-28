import {Position} from "../position";
import {SelectionOrTransition} from "../../utilities/d3";
import {Rect, rectCenter} from "./rect";

export interface Ellipse {
  center: Position;
  rx: number;
  ry: number;
  color?: string;
}

export function ellipseInsideRect(rect: Rect): Ellipse {
  return { center: rectCenter(rect), rx: rect.width / 2, ry: rect.height / 2 };
}

export function ellipseToAttrs(selectionOrTransition: SelectionOrTransition, ellipse: Ellipse): void {
  selectionOrTransition.attr('cx', ellipse.center.x) //Typescript Problem on chaining?
  selectionOrTransition.attr('cy', ellipse.center.y)
  selectionOrTransition.attr('rx', ellipse.rx)
  selectionOrTransition.attr('ry', ellipse.ry)
  selectionOrTransition.attr('fill', ellipse.color ?? null)
}
