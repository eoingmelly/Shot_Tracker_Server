// jest.setup.js

process.env.NODE_ENV = "test";
process.env.PORT = "4001";

process.env.JWT_SECRET = "just_between_us";

process.env.AWS_REGION = "eu-region-fake";
process.env.USER_POOL_ID = "cog-user-pool";
