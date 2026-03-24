// modules/identity/__tests__/index.test.js

const { createIdentityModule } = require("../index");
const { IdentityService } = require("../application/identity-service");

describe("identity module (index)", () => {
  test("creates IdentityService with injected identityProvider override", () => {
    const fakeRepo = {};
    const fakeProvider = {};

    const module = createIdentityModule({
      golferRepository: fakeRepo,
      identityProvider: fakeProvider,
    });

    expect(module.identityService).toBeInstanceOf(IdentityService);
  });

  test("creates IdentityService using Cognito factory when no override provided", () => {
    const fakeRepo = {};

    const module = createIdentityModule({
      golferRepository: fakeRepo,
    });

    expect(module.identityService).toBeInstanceOf(IdentityService);
  });
});
