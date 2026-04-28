const { AuthService } = require("../auth-service");
const {
  MissingTokenError,
} = require("../../domain/errors/missing-token-error");

describe("AuthService", () => {
  describe("constructor", () => {
    test("throws when tokenVerifier is not provided", () => {
      expect(() => {
        new AuthService({});
      }).toThrow("AuthService requires tokenVerifier");
    });
  });

  describe("authenticate", () => {
    test("throws when token is missing", async () => {
      const tokenVerifier = { verify: jest.fn() };
      const authService = new AuthService({ tokenVerifier });

      await expect(authService.authenticate()).rejects.toBeInstanceOf(
        MissingTokenError,
      );

      expect(tokenVerifier.verify).not.toHaveBeenCalled();
    });

    test("throws when token is empty", async () => {
      const tokenVerifier = { verify: jest.fn() };
      const authService = new AuthService({ tokenVerifier });

      await expect(authService.authenticate("   ")).rejects.toBeInstanceOf(
        MissingTokenError,
      );

      expect(tokenVerifier.verify).not.toHaveBeenCalled();
    });

    test("passes trimmed token to verifier and hydrates golferId", async () => {
      const verifyResult = {
        sub: "cognito-sub-1",
        email: "test@example.com",
      };

      const tokenVerifier = {
        verify: jest.fn().mockResolvedValue(verifyResult),
      };

      const golferLookupAdapter = {
        getGolferId: jest.fn().mockResolvedValue("golfer-1"),
      };

      const authService = new AuthService({ tokenVerifier });

      await authService.lazyLoadGolferLookupAdapter({
        golferLookupAdapter,
      });

      const result = await authService.authenticate("  Bearer abc123  ");

      expect(tokenVerifier.verify).toHaveBeenCalledTimes(1);
      expect(tokenVerifier.verify).toHaveBeenCalledWith("Bearer abc123");

      expect(golferLookupAdapter.getGolferId).toHaveBeenCalledTimes(1);
      expect(golferLookupAdapter.getGolferId).toHaveBeenCalledWith({
        sub: "cognito-sub-1",
      });

      expect(result).toEqual({
        sub: "cognito-sub-1",
        email: "test@example.com",
        golferId: "golfer-1",
      });
    });

    test("returns verifier result when verifier returns null", async () => {
      const tokenVerifier = {
        verify: jest.fn().mockResolvedValue(null),
      };

      const authService = new AuthService({ tokenVerifier });

      const result = await authService.authenticate("Bearer abc123");

      expect(result).toBeNull();
    });

    test("rethrows verifier errors", async () => {
      const error = new Error("invalid token");

      const tokenVerifier = {
        verify: jest.fn().mockRejectedValue(error),
      };

      const authService = new AuthService({ tokenVerifier });

      await expect(
        authService.authenticate("Bearer bad-token"),
      ).rejects.toThrow("invalid token");

      expect(tokenVerifier.verify).toHaveBeenCalledWith("Bearer bad-token");
    });
  });

  describe("lazyLoadGolferLookupAdapter", () => {
    test("loads golferLookupAdapter when not already loaded", async () => {
      const tokenVerifier = { verify: jest.fn() };
      const authService = new AuthService({ tokenVerifier });

      const golferLookupAdapter = {
        getGolferId: jest.fn(),
      };

      await authService.lazyLoadGolferLookupAdapter({
        golferLookupAdapter,
      });

      expect(authService._golferLookupAdapter).toBe(golferLookupAdapter);
    });

    test("does not replace golferLookupAdapter once loaded", async () => {
      const tokenVerifier = { verify: jest.fn() };
      const authService = new AuthService({ tokenVerifier });

      const firstAdapter = { getGolferId: jest.fn() };
      const secondAdapter = { getGolferId: jest.fn() };

      await authService.lazyLoadGolferLookupAdapter({
        golferLookupAdapter: firstAdapter,
      });

      await authService.lazyLoadGolferLookupAdapter({
        golferLookupAdapter: secondAdapter,
      });

      expect(authService._golferLookupAdapter).toBe(firstAdapter);
    });
  });
});
