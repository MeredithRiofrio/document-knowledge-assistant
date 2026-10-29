import { http, HttpResponse } from "msw";

const demoTokens = {
  access_token: "mock-access-token",
  refresh_token: "mock-refresh-token",
};

export const authHandlers = [
  http.post("/register", async ({ request }) => {
    const user = await request.json();
    if (!user?.email || String(user.password || "").length < 6) {
      return HttpResponse.json(
        { message: "Enter a valid email and a password with at least 6 characters." },
        { status: 422 }
      );
    }
    return HttpResponse.json(
      { status: "success", message: "Demo account created", data: { id: "mock-user" } },
      { status: 201 }
    );
  }),
  http.post("/login", async ({ request }) => {
    const credentials = await request.json();
    if (!credentials?.email || !credentials?.password) {
      return HttpResponse.json(
        { message: "Enter an email and password to continue." },
        { status: 422 }
      );
    }
    return HttpResponse.json({
      status: "success",
      message: "Demo session started",
      data: demoTokens,
    });
  }),
  http.post("/refresh", () =>
    HttpResponse.json({
      status: "success",
      message: "Demo session refreshed",
      data: { access_token: demoTokens.access_token },
    })
  ),
];
