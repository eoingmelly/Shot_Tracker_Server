// modules/identity/application/__tests__/identity-service.test.js

const { IdentityService } = require("../identity-service");

describe("IdentityService", () => {
  const makeDeps = (overrides = {}) => {
    const golferRepository = {
      getById: jest.fn(),
      ...overrides.golferRepository,
    };

    const identityProvider = {
      getUserByEmail: jest.fn(),
      createUser: jest.fn(),
      enableUser: jest.fn(),
      setPassword: jest.fn(),
      disableUser: jest.fn(),
      confirmUser: jest.fn(),
      addUserToGroup: jest.fn(),

      ...overrides.identityProvider,
    };

    return { golferRepository, identityProvider };
  };

  describe("constructor validation", () => {
    test("throws when identityProvider missing", () => {
      expect(() => new IdentityService({ golferRepository: {} })).toThrow(
        "IdentityService requires { identityProvider }",
      );
    });
  });

  describe("setEnabled", () => {
    test("throws when userId missing", async () => {
      const service = new IdentityService(makeDeps());

      await expect(service.setEnabled({ enabled: true })).rejects.toThrow(
        "setEnabled requires { userId }",
      );
    });

    test("throws when enabled not boolean", async () => {
      const service = new IdentityService(makeDeps());

      await expect(
        service.setEnabled({ userId: "u1", enabled: "yes" }),
      ).rejects.toThrow("setEnabled requires { enabled: boolean }");
    });
  });

  describe("confirmAccount", () => {
    test("throws when userId missing", async () => {
      const service = new IdentityService(makeDeps());

      await expect(service.confirmAccount({})).rejects.toThrow(
        "confirmAccount requires { userId }",
      );
    });
  });

  describe("addToGroup", () => {
    test("throws when userId missing", async () => {
      const service = new IdentityService(makeDeps());

      await expect(service.addToGroup({ groupName: "x" })).rejects.toThrow(
        "addToGroup requires { userId }",
      );
    });

    test("throws when groupName missing", async () => {
      const service = new IdentityService(makeDeps());

      await expect(service.addToGroup({ userId: "u1" })).rejects.toThrow(
        "addToGroup requires { groupName }",
      );
    });
  });
});
