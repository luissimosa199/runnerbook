import {
  handleDeleteImage,
  getCurrentDateTimeString,
  createPhotoData,
  createDataObject,
  sendData,
} from "./formHelpers";
import fetchMock from "jest-fetch-mock";

jest.mock("./convertToJpeg", () => ({
  convertToJpeg: jest.fn().mockImplementation((file: any) => file),
}));

jest.mock("sweetalert2", () => ({
  fire: jest.fn(),
}));

global.fetch = fetchMock as any;

describe("formHelpers", () => {
  // handleDeleteImage()

  describe("handleDeleteImage", () => {
    it("deberia eliminar la imagen de un index especifico", () => {
      const images = ["image1", "image2", "image3"];
      const setImages = jest.fn();
      const setPreviews = jest.fn();
      const currentIdx = 1;
      const event = { preventDefault: jest.fn() };

      handleDeleteImage(event as any, currentIdx, setImages, setPreviews);

      const modifyImagesFunction = setImages.mock.calls[0][0];
      const newImages = modifyImagesFunction(images);

      expect(newImages).toEqual(["image1", "image3"]);
      expect(event.preventDefault).toHaveBeenCalled();
    });
  });

  // getData()

  describe("sendData", () => {
    afterEach(() => {
      fetchMock.resetMocks();
    });

    it("should make the POST request with main text and empty photo array", async () => {
      const mockData = {
        mainText: "Prueba",
        photo: [],
        length: 0,
        tags: ["tag1", "tag2"],
        authorId: 'user1@domain.com',
        authorName: 'user1'
      };

      fetchMock.mockResponseOnce(JSON.stringify({ message: "Success" }));

      const response = await sendData(mockData);

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/timeline",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(mockData),
        })
      );

      const responseData = await response.json();
      expect(responseData).toEqual({ message: "Success" });
    });

    it("should make the POST request with empty main text and non-empty photo array", async () => {
      const mockData = {
        mainText: "",
        photo: [{ url: "https://image.img", idx: 0, caption: "prueba" }],
        length: 1,
        tags: ["tag1", "tag2"],
        authorId: 'user1@domain.com',
        authorName: 'user1'
      };

      fetchMock.mockResponseOnce(JSON.stringify({ message: "Success" }));

      const response = await sendData(mockData);

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/timeline",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(mockData),
        })
      );

      const responseData = await response.json();
      expect(responseData).toEqual({ message: "Success" });
    });
  });

  // getCurrentDateTimeString()

  describe("getCurrentDateTimeString", () => {
    let RealDate: DateConstructor;

    beforeAll(() => {
      RealDate = global.Date;
      const constantDate = new Date("2023-04-26T00:00:00");
      global.Date = class extends RealDate {
        constructor() {
          super();
          return constantDate;
        }
      } as any;
    });

    afterAll(() => {
      global.Date = RealDate;
    });

    it("deberia retornar el correcto string de fecha", () => {
      const result = getCurrentDateTimeString();
      expect(result).toBe("2023-04-26T00:00:00.000Z");
    });
  });

  // createPhotoData()

  describe("createPhotoData", () => {
    it("deberia procesar los datos de las imagenes correctamente", () => {
      const paths = ["path1", "path2", "path3"];
      const imagesCaption = [
        { idx: 0, value: "caption1" },
        { idx: 1, value: "caption2" },
        { idx: 2, value: "caption3" },
      ];

      const result = createPhotoData(paths, imagesCaption);
      expect(result).toEqual([
        { url: "path1", idx: 0, caption: "caption1" },
        { url: "path2", idx: 1, caption: "caption2" },
        { url: "path3", idx: 2, caption: "caption3" },
      ]);
    });

    it("deberia manejar imagenes sin caption", () => {
      const paths = ["path1", "path2", "path3"];
      const imagesCaption: { idx: number; value: string }[] = [];

      const result = createPhotoData(paths, imagesCaption);
      expect(result).toEqual([
        { url: "path1", idx: 0, caption: undefined },
        { url: "path2", idx: 1, caption: undefined },
        { url: "path3", idx: 2, caption: undefined },
      ]);
    });
  });

  // createDataObject()

  describe("createDataObject", () => {
    it("deberia procesar los datos del timeline correctamente", () => {
      const data = { mainText: "Test text" };
      const photos = [{ url: "test_url", idx: 0, caption: "Test caption" }];
      const tagsList = ["tag1", "tag2"];
      const session = { user: { name: 'user1', email: 'user1@domain.com' }, expires: '2023-09-02T14:57:44.893Z' }

      const result = createDataObject(data, photos, tagsList, session);

      expect(result).toEqual({
        mainText: "Test text",
        photo: [{ url: "test_url", idx: 0, caption: "Test caption" }],
        length: 1,
        tags: ["tag1", "tag2"],
        authorId: 'user1@domain.com',
        authorName: 'user1'
      });
    });

    it("deberia manejar un mainText vacio", () => {
      const data = {};
      const photos = [{ url: "test_url", idx: 0, caption: "Test caption" }];
      const tagsList = ["tag1", "tag2"];
      const session = { user: { name: 'user1', email: 'user1@domain.com' }, expires: '2023-09-02T14:57:44.893Z' }

      const result = createDataObject(data, photos, tagsList, session);
      expect(result).toEqual({
        mainText: "",
        photo: [{ url: "test_url", idx: 0, caption: "Test caption" }],
        length: 1,
        tags: ["tag1", "tag2"],
        authorId: 'user1@domain.com',
        authorName: 'user1'
      });
    });
  });
});
