import { describe, expect, it } from "vitest";

import { completeProperty } from "./jsCompletion";

const values = (matches: { value: string }[]) => matches.map(({ value }) => value);

class Shape {
  sides = 4;
  area() {
    return 0;
  }
}

let touched = 0;

const root = {
  document: {
    title: "Home",
    body: { id: "", innerText: "" },
    querySelector: () => null,
  },
  shape: new Shape(),
  greeting: "hello",
  nothing: null,
  get trap() {
    touched++;
    return { inside: 1 };
  },
};

describe("completeProperty", () => {
  it("finishes a name after a dot", () => {
    expect(values(completeProperty("document.ti", root))).toEqual(["document.title"]);
    expect(values(completeProperty("document.body.in", root))).toEqual(["document.body.innerText"]);
  });

  it("puts the shortest of the matching names first", () => {
    expect(values(completeProperty("document.body.i", root)).slice(0, 2)).toEqual([
      "document.body.id",
      "document.body.innerText",
    ]);
    expect(values(completeProperty("greeting.to", root))[0]).toBe("greeting.toString");
  });

  it("lists every name once the dot is typed", () => {
    expect(values(completeProperty("document.body.", root)).slice(0, 2)).toEqual([
      "document.body.id",
      "document.body.innerText",
    ]);
  });

  it("finishes a global, the ones a console is opened for first", () => {
    expect(values(completeProperty("doc", root))).toEqual(["document"]);
    expect(values(completeProperty("s", root))).toEqual(["shape"]);
  });

  it("keeps what comes before the name", () => {
    expect(values(completeProperty("const t = document.ti", root))).toEqual([
      "const t = document.title",
    ]);
    expect(values(completeProperty("alert(document.ti", root))).toEqual(["alert(document.title"]);
  });

  it("says which names are known to be functions", () => {
    expect(completeProperty("document.q", root)).toEqual([
      { value: "document.querySelector", method: true },
    ]);
    expect(completeProperty("document.ti", root)).toEqual([
      { value: "document.title", method: false },
    ]);
  });

  it("reaches the names a prototype gives", () => {
    expect(values(completeProperty("shape.", root)).slice(0, 2)).toEqual([
      "shape.sides",
      "shape.area",
    ]);
    expect(values(completeProperty("greeting.toUpperC", root))).toEqual(["greeting.toUpperCase"]);
  });

  it("offers a name in another case after the ones that match exactly", () => {
    expect(values(completeProperty("document.TI", root))).toEqual(["document.title"]);
    expect(values(completeProperty("greeting.ToUpper", root))).toEqual(["greeting.toUpperCase"]);
  });

  it("offers nothing for a name already typed in full", () => {
    expect(completeProperty("document.title", root)).toEqual([]);
  });

  it("offers nothing where the path starts somewhere it cannot follow", () => {
    expect(completeProperty("make().ti", root)).toEqual([]);
    expect(completeProperty("items[0].ti", root)).toEqual([]);
    expect(completeProperty("nothing.ti", root)).toEqual([]);
    expect(completeProperty("missing.ti", root)).toEqual([]);
    expect(completeProperty("1 + ", root)).toEqual([]);
  });

  it("offers nothing inside a string", () => {
    expect(completeProperty("'document.ti", root)).toEqual([]);
    expect(completeProperty('say("doc', root)).toEqual([]);
    expect(values(completeProperty("'it\\'s' + document.ti", root))).toEqual([
      "'it's' + document.title".replace("it's", "it\\'s"),
    ]);
  });

  it("never runs a getter somebody wrote to find what is behind it", () => {
    expect(completeProperty("trap.in", root)).toEqual([]);
    expect(values(completeProperty("tr", root))).toEqual(["trap"]);
    expect(touched).toBe(0);
  });
});
