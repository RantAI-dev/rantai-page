import type { DecoOption } from "./decorations";

export interface DrawThumbnailOptions {
  color: string;
  deco: DecoOption | null;
  customDecorationUrl: string | null;
  customDecorationScale: number;
  iconSource: { type: "svg"; el: SVGSVGElement } | { type: "url"; url: string };
  iconScale: number;
  noiseEnabled: boolean;
  noiseIntensity: number;
}
