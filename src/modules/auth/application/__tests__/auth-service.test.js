const { AuthService } = require("../auth-service");
const {
  MissingTokenError,
} = require("../../domain/errors/missing-token-error");

describe("AuthService", () => {
  test("throws when token is missing", async () => {
    const tokenVerifier = {
      verify: jest.fn(),
    };

    const authService = new AuthService({ tokenVerifier });

    await expect(authService.authenticate()).rejects.toBeInstanceOf(
      MissingTokenError,
    );

    expect(tokenVerifier.verify).not.toHaveBeenCalled();
  });

  test("throws when token is empty", async () => {
    const tokenVerifier = {
      verify: jest.fn(),
    };

    const authService = new AuthService({ tokenVerifier });

    await expect(authService.authenticate("   ")).rejects.toBeInstanceOf(
      MissingTokenError,
    );

    expect(tokenVerifier.verify).not.toHaveBeenCalled();
  });

  test("passes trimmed token to verifier", async () => {
    const tokenVerifier = {
      verify: jest.fn().mockResolvedValue({
        userId: "user-123",
      }),
    };

    const authService = new AuthService({ tokenVerifier });

    const result = await authService.authenticate("  Bearer abc123  ");

    expect(tokenVerifier.verify).toHaveBeenCalledTimes(1);
    expect(tokenVerifier.verify).toHaveBeenCalledWith("Bearer abc123");
    expect(result).toEqual({
      userId: "user-123",
    });
  });

  test("rethrows verifier errors", async () => {
    const tokenVerifier = {
      verify: jest.fn().mockRejectedValue(new Error("invalid token")),
    };

    const authService = new AuthService({ tokenVerifier });

    await expect(authService.authenticate("Bearer bad-token")).rejects.toThrow(
      "invalid token",
    );

    expect(tokenVerifier.verify).toHaveBeenCalledWith("Bearer bad-token");
  });
});
