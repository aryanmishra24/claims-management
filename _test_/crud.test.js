import { PrismaClient } from '@prisma/client';
import {
  createPolicyholder,
  updatePolicyholder,
  getPolicyholder,
  createPolicy,
  updatePolicy,
  getPoliciesByPolicyholder,
  createClaim,
  updateClaim,
  getClaimsByPolicy,
  deletePolicyholder,
  deletePolicy,
  deleteClaim,
} from '../crud.js';

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

// Mock data
const policyholderId = "ph123";
const policyId = "p123";
const claimId = "c123";

describe("Policyholder CRUD", () => {
  test("Create a policyholder with valid data", async () => {
    const policyholder = await createPolicyholder(policyholderId, "John Doe", "john.doe@example.com");
    expect(policyholder).toHaveProperty("id", policyholderId);
    expect(policyholder).toHaveProperty("name", "John Doe");
  });

  test("Fail to create policyholder with empty name", async () => {
    await expect(createPolicyholder("ph124", "", "valid@email.com")).rejects.toThrow("Name and contact info must not be empty.");
  });

  test("Fail to create policyholder with invalid contact", async () => {
    await expect(createPolicyholder("ph125", "Alice", "invalid_contact")).rejects.toThrow("Contact info should be a valid email or phone number.");
  });

  test("Retrieve an existing policyholder", async () => {
    const policyholder = await getPolicyholder(policyholderId);
    expect(policyholder).not.toBeNull();
    expect(policyholder.name).toBe("John Doe");
  });

  test("Update policyholder name", async () => {
    const updated = await updatePolicyholder(policyholderId, "Jane Doe", null);
    expect(updated.name).toBe("Jane Doe");
  });

  test("Update policyholder contact", async () => {
    const updated = await updatePolicyholder(policyholderId, null, "new.email@example.com");
    expect(updated.contactInfo).toBe("new.email@example.com");
  });
});

describe("Policy CRUD", () => {
  test("Create a policy with valid data", async () => {
    const policy = await createPolicy(policyId, policyholderId, 1000);
    expect(policy).toHaveProperty("id", policyId);
    expect(policy.policyAmount).toBe(1000);
  });

  test("Fail to create policy with amount <= 0", async () => {
    await expect(createPolicy("p124", policyholderId, 0)).rejects.toThrow("The policy amount must be greater than 0.");
  });

  test("Fail to create policy for non-existent policyholder", async () => {
    await expect(createPolicy("p125", "invalid_ph", 500)).rejects.toThrow("Invalid Policyholder ID.");
  });

  test("Retrieve policies by policyholder", async () => {
    const policies = await getPoliciesByPolicyholder(policyholderId);
    expect(policies.length).toBeGreaterThan(0);
  });

  test("Update policy amount", async () => {
    const updated = await updatePolicy(policyId, 1500);
    expect(updated.policyAmount).toBe(1500);
  });
});

describe("Claim CRUD", () => {
  test("Create a claim with valid data", async () => {
    const claim = await createClaim(claimId, policyId, 500);
    expect(claim).toHaveProperty("id", claimId);
    expect(claim.amount).toBe(500);
  });

  test("Fail to create claim exceeding policy amount", async () => {
    await expect(createClaim("c124", policyId, 2000)).rejects.toThrow("Claim amount exceeds policy coverage.");
  });

  test("Fail to create claim for non-existent policy", async () => {
    await expect(createClaim("c125", "invalid_policy", 500)).rejects.toThrow("Invalid Policy ID.");
  });

  test("Retrieve claims by policy", async () => {
    const claims = await getClaimsByPolicy(policyId);
    expect(claims.length).toBeGreaterThan(0);
  });

  test("Update claim amount", async () => {
    const updated = await updateClaim(claimId, 400);
    expect(updated.amount).toBe(400);
  });
});

describe("Delete Operations", () => {
  test("Delete claim", async () => {
    const deleted = await deleteClaim(claimId);
    expect(deleted).toHaveProperty("id", claimId);
  });

  test("Delete policy", async () => {
    const deleted = await deletePolicy(policyId);
    expect(deleted).toHaveProperty("id", policyId);
  });

  test("Delete policyholder", async () => {
    const deleted = await deletePolicyholder(policyholderId);
    expect(deleted).toHaveProperty("id", policyholderId);
  });
});
