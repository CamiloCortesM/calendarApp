import calendarApi from "../../src/api/calendarApi";

describe("test in the CalendarApi", () => {
  test("must have the default configuration", () => {
    // console.log(calendarApi);
    expect(calendarApi.defaults.baseURL).toBe(process.env.VITE_API_URL);
  });

  test("must have the x-token in the header of all requests. ", async () => {
    const token = "AB-123-XYZ";
    localStorage.setItem("token", token);
    const res = await calendarApi.get("/auth");
    expect(res.config.headers["x-token"]).toBe(token);
  });
});
