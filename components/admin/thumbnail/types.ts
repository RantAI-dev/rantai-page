import type { DecoOption } from "./decorations";

export interface DrawThumbnailOptions {
  color: string;
  deco: DecoOption | null;
  customDecorationUrl: string | null;
  iconSource: { type: "svg"; el: SVGSVGElement } | { type: "url"; url: string };
  noiseEnabled: boolean;
  noiseIntensity: number;
}
