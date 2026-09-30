import { describe, expect, it } from "vitest";

import { deliveryUrl, parseCloudinaryUrl, publicIdFromPath, signParams } from "./cloudinary.ts";

describe("parseCloudinaryUrl", () => {
  it("reads the key, the secret and the cloud name", () => {
    expect(parseCloudinaryUrl("cloudinary://123456:s3cr%2Fet@dialh0kqy")).toEqual({
      cloudName: "dialh0kqy",
      apiKey: "123456",
      apiSecret: "s3cr/et",
    });
  });

  it("refuses anything that is not a cloudinary:// URL with both halves of the key", () => {
    expect(() => parseCloudinaryUrl("not a url")).toThrow(/cloudinary:\/\//);
    expect(() => parseCloudinaryUrl("https://123:abc@dialh0kqy")).toThrow(/cloudinary:\/\//);
    expect(() => parseCloudinaryUrl("cloudinary://123@dialh0kqy")).toThrow(/cloudinary:\/\//);
  });
});

describe("signParams", () => {
  // The worked example from Cloudinary's "Generating authentication
  // signatures" documentation.
  it("matches Cloudinary's documented signature", () => {
    const params = {
      timestamp: "1315060510",
      public_id: "sample_image",
      eager: "w_400,h_300,c_pad|w_260,h_200,c_crop",
    };
    expect(signParams(params, "abcd")).toBe("bfd09f95f331f558cbd1320e67aa8d488770583e");
  });

  it("does not depend on the order the parameters were given in", () => {
    const secret = "abcd";
    expect(signParams({ b: "2", a: "1" }, secret)).toBe(signParams({ a: "1", b: "2" }, secret));
  });

  it("leaves empty parameters out, as Cloudinary does", () => {
    expect(signParams({ a: "1", folder: "" }, "abcd")).toBe(signParams({ a: "1" }, "abcd"));
  });
});

describe("publicIdFromPath", () => {
  it("makes a kebab-case id from the file name", () => {
    expect(publicIdFromPath("/tmp/Diamond System Diagram.PNG")).toBe("diamond-system-diagram");
    expect(publicIdFromPath("kulcsár_rudolf (1).jpg")).toBe("kulcsar-rudolf-1");
  });

  it("refuses a name with nothing left to use", () => {
    expect(() => publicIdFromPath("___.png")).toThrow(/--id/);
  });
});

describe("deliveryUrl", () => {
  it("asks for automatic quality and format", () => {
    expect(
      deliveryUrl("https://res.cloudinary.com/dialh0kqy/image/upload/v1790789508/diagram.png"),
    ).toBe(
      "https://res.cloudinary.com/dialh0kqy/image/upload/q_auto/f_auto/v1790789508/diagram.png",
    );
  });
});
