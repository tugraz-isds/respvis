import {SelectionOrTransition} from '../../d3/selection';
import {Position, positionEquals, positionRound} from '../position/position';
import {Rect, rectCenter} from './rect/rect';
import {isElement} from "../../dom/element/element";
import {select} from "d3";

export interface Circle {
  center: Position;
  radius: number;
  color?: number;
}

export function circleRound(circle: Circle, decimals: number = 0): Circle {
  const e = Math.pow(10, decimals);
  return {
    center: positionRound(circle.center, decimals),
    radius: Math.round(circle.radius * e) / e,
  };
}

export function circleEquals(a: Circle, b: Circle, epsilon: number = 0.001): boolean {
  return positionEquals(a.center, b.center, epsilon) && Math.abs(a.radius - b.radius) < epsilon;
}

export function circleToString(circle: Circle, decimals: number = 1): string {
  circle = circleRound(circle, decimals);
  return `${circle.center.x}, ${circle.center.y}, ${circle.radius}`;
}

export function circleFromString(str: string): Circle {
  const parts = str.split(',').map((s) => parseFloat(s.trim()));
  return { center: { x: parts[0], y: parts[1] }, radius: parts[2] };
}

export function circleToAttrs(selectionOrTransition: SelectionOrTransition, circle: Circle): void {
  selectionOrTransition.attr('cx', circle.center.x) //Typescript Problem on chaining?
  selectionOrTransition.attr('cy', circle.center.y)
  selectionOrTransition.attr('r', circle.radius)
  selectionOrTransition.attr('fill', circle.color ?? null)
}

export function circleToAttrsFromSelection(selectionOrTransition: SelectionOrTransition<any, Circle>) {
  selectionOrTransition.attr('cx', (d) => d.center.x) //Typescript Problem on chaining?
  selectionOrTransition.attr('cy', (d) => d.center.y)
  selectionOrTransition.attr('r', (d) => d.radius)
  selectionOrTransition.attr('fill', (d) => d.color ?? null)
}

export function circleFromAttrs(selectionOrTransition: SelectionOrTransition): Circle {
  const s = selectionOrTransition.selection();
  return {
    center: { x: parseFloat(s.attr('cx') || '0'), y: parseFloat(s.attr('cy') || '0') },
    radius: parseFloat(s.attr('r') || '0'),
  };
}

export function circleMinimized(circle: Circle): Circle {
  return { center: circle.center, radius: 0 };
}

export function circleFitStroke(circle: Circle, stroke: number): Circle {
  return { center: circle.center, radius: circle.radius - stroke / 2 };
}

export function circlePosition(
  circle: Circle,
  angleInDegrees: number,
  distancePercentage: number = 1
): Position {
  const angleInRad = (angleInDegrees * Math.PI) / 180;
  return {
    x: circle.center.x + circle.radius * Math.cos(angleInRad) * distancePercentage,
    y: circle.center.y + circle.radius * Math.sin(angleInRad) * distancePercentage,
  };
}

export function circleInsideRect(rect: Rect): Circle {
  return { center: rectCenter(rect), radius: Math.min(rect.width, rect.height) / 2 };
}

export function circleOutsideRect(rect: Rect): Circle {
  return {
    center: rectCenter(rect),
    radius: Math.sqrt(Math.pow(rect.width, 2) + Math.pow(rect.height, 2)) / 2,
  };
}

export function circleToPath(
  selectionOrTransition: SelectionOrTransition | Element,
  circle: Circle
): void {
  const {
    center: {x: cx, y: cy},
    radius: r,
  } = circle;

  selectionOrTransition = isElement(selectionOrTransition)
    ? select(selectionOrTransition)
    : selectionOrTransition;

  selectionOrTransition.attr(
    'd',
    `M ${cx - r} ${cy} 
    a ${r},${r} 0 1,0 ${r * 2},0 
    a ${r},${r} 0 1,0 -${r * 2},0`
  );
}
