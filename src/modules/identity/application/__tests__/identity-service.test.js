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
      forceSignOut: jest.fn(),
      ...overrides.identityProvider,
    };

    return { golferRepository, identityProvider };
  };

  describe("constructor validation", () => {
    test("throws when golferRepository missing", () => {
      expect(() => new IdentityService({ identityProvider: {} })).toThrow(
        "IdentityService requires { golferRepository }",
      );
    });

    test("throws when identityProvider missing", () => {
      expect(() => new IdentityService({ golferRepository: {} })).toThrow(
        "IdentityService requires { identityProvider }",
      );
    });
  });

  describe("setEnabled", () => {
    test("enables golfer when enabled=true", async () => {
      const deps = makeDeps();

      deps.golferRepository.getById.mockResolvedValue({
        id: "u1",
        email: "a@example.com",
        organisationId: "org1",
      });

      const service = new IdentityService(deps);

      await service.setEnabled({ userId: "u1", enabled: true });

      expect(deps.identityProvider.enableUser).toHaveBeenCalledWith({
        email: "a@example.com",
      });
      expect(deps.identityProvider.disableUser).not.toHaveBeenCalled();
    });

    test("disables golfer when enabled=false", async () => {
      const deps = makeDeps();

      deps.golferRepository.getById.mockResolvedValue({
        id: "u1",
        email: "a@example.com",
        organisationId: "org1",
      });

      const service = new IdentityService(deps);

      await service.setEnabled({ userId: "u1", enabled: false });

      expect(deps.identityProvider.disableUser).toHaveBeenCalledWith({
        email: "a@example.com",
      });
      expect(deps.identityProvider.enableUser).not.toHaveBeenCalled();
    });

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

    test("throws when golfer not found", async () => {
      const deps = makeDeps();
      deps.golferRepository.getById.mockResolvedValue(null);

      const service = new IdentityService(deps);

      await expect(
        service.setEnabled({ userId: "u1", enabled: true }),
      ).rejects.toThrow("golfer not found");
    });

    test("throws when golfer missing email", async () => {
      const deps = makeDeps();
      deps.golferRepository.getById.mockResolvedValue({});

      const service = new IdentityService(deps);

      await expect(
        service.setEnabled({ userId: "u1", enabled: true }),
      ).rejects.toThrow("golfer missing email");
    });
  });

  describe("confirmAccount", () => {
    test("confirms golfer", async () => {
      const deps = makeDeps();

      deps.golferRepository.getById.mockResolvedValue({
        id: "u1",
        email: "a@example.com",
        organisationId: "org1",
      });

      const service = new IdentityService(deps);

      await service.confirmAccount({ userId: "u1" });

      expect(deps.identityProvider.confirmUser).toHaveBeenCalledWith({
        email: "a@example.com",
      });
    });

    test("throws when userId missing", async () => {
      const service = new IdentityService(makeDeps());

      await expect(service.confirmAccount({})).rejects.toThrow(
        "confirmAccount requires { userId }",
      );
    });

    test("throws when golfer not found", async () => {
      const deps = makeDeps();
      deps.golferRepository.getById.mockResolvedValue(null);

      const service = new IdentityService(deps);

      await expect(service.confirmAccount({ userId: "u1" })).rejects.toThrow(
        "golfer not found",
      );
    });
  });

  describe("addToGroup", () => {
    test("adds golfer to group", async () => {
      const deps = makeDeps();

      deps.golferRepository.getById.mockResolvedValue({
        id: "u1",
        email: "a@example.com",
        organisationId: "org1",
      });

      const service = new IdentityService(deps);

      await service.addToGroup({ userId: "u1", groupName: "superUsers" });

      expect(deps.identityProvider.addUserToGroup).toHaveBeenCalledWith({
        email: "a@example.com",
        groupName: "superUsers",
      });
    });

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

  describe("forceSignOut", () => {
    test("forces sign out", async () => {
      const deps = makeDeps();

      deps.golferRepository.getById.mockResolvedValue({
        id: "u1",
        email: "a@example.com",
        organisationId: "org1",
      });

      const service = new IdentityService(deps);

      await service.forceSignOut({ userId: "u1" });

      expect(deps.identityProvider.forceSignOut).toHaveBeenCalledWith({
        email: "a@example.com",
      });
    });

    test("throws when userId missing", async () => {
      const service = new IdentityService(makeDeps());

      await expect(service.forceSignOut({})).rejects.toThrow(
        "forceSignOut requires { userId }",
      );
    });

    test("throws when golfer not found", async () => {
      const deps = makeDeps();
      deps.golferRepository.getById.mockResolvedValue(null);

      const service = new IdentityService(deps);

      await expect(service.forceSignOut({ userId: "u1" })).rejects.toThrow(
        "golfer not found",
      );
    });
  });
});
