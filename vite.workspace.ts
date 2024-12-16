import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  {
    test: {
      name: "node",
      environment: "node",
      include: ["backend/**/*.test.ts"],
      globals: true,
    },
  },
]);
