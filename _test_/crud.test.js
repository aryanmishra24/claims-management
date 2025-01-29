import { createPolicyholder, getPolicyholder, createPolicy, createClaim } from "../crud.js";

test("Create and retrieve a policyholder", () => {
    createPolicyholder("holder_001", "John Doe", "john@example.com");
    const policyholder = getPolicyholder("holder_001");
    expect(policyholder.name).toBe("John Doe");
});

test("Prevent duplicate policyholders", () => {
    expect(() => createPolicyholder("holder_001", "Jane Doe", "jane@example.com")).toThrow("Policyholder already exists.");
});

test("Create a valid policy", () => {
    createPolicy("policy_123", "holder_001", 10000);
    expect(getPolicyholder("holder_001")).not.toBeNull();
});

test("Reject claim exceeding policy amount", () => {
    expect(() => createClaim("claim_001", "policy_123", 20000)).toThrow("Claim exceeds policy amount.");
});
