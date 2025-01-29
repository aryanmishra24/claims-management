import { Policyholder, Policy, Claim } from "./entities.js";

const policyholders = new Map();
const policies = new Map();
const claims = new Map();

// ✅ Policyholder CRUD
export function createPolicyholder(id, name, contactInfo) {
  if (policyholders.has(id)) throw new Error("Policyholder already exists.");
  if (!name || typeof name !== "string") throw new Error("Invalid name.");
  if (!contactInfo || !/\S+@\S+\.\S+/.test(contactInfo)) throw new Error("Invalid contact info."); // Simple email validation

  policyholders.set(id, new Policyholder(id, name, contactInfo));
}


export function getPolicyholder(id) {
    return policyholders.get(id) || null;
}

export function updatePolicyholder(id, name, contactInfo) {
    if (!policyholders.has(id)) throw new Error("Policyholder not found.");
    const policyholder = policyholders.get(id);
    if (name) policyholder.name = name;
    if (contactInfo) policyholder.contactInfo = contactInfo;
}

export function deletePolicyholder(id) {
    if (!policyholders.has(id)) throw new Error("Policyholder not found.");
    policyholders.delete(id);
}

// ✅ Policy CRUD
export function createPolicy(id, policyholderId, policyAmount) {
  if (!policyholders.has(policyholderId)) throw new Error("Invalid Policyholder.");
  if (policyAmount <= 0) throw new Error("Policy amount must be greater than 0.");

  // Check if policyholder has more than 5 policies
  const policiesOwned = [...policies.values()].filter(p => p.policyholderId === policyholderId);
  if (policiesOwned.length >= 5) throw new Error("A policyholder cannot have more than 5 policies.");

  policies.set(id, new Policy(id, policyholderId, policyAmount));
}


export function getPolicy(id) {
    return policies.get(id) || null;
}

export function updatePolicy(id, policyAmount) {
    if (!policies.has(id)) throw new Error("Policy not found.");
    const policy = policies.get(id);
    if (policyAmount) policy.policyAmount = policyAmount;
}

export function deletePolicy(id) {
    if (!policies.has(id)) throw new Error("Policy not found.");
    policies.delete(id);
}

// ✅ Claim CRUD (with validation)
export function createClaim(id, policyId, claimAmount) {
  if (!policies.has(policyId)) throw new Error("Invalid Policy.");
  const policy = policies.get(policyId);
  if (claimAmount <= 0) throw new Error("Claim amount must be greater than 0.");
  if (claimAmount > policy.policyAmount) throw new Error("Claim exceeds policy amount.");

  // Check if the policyholder already has 3 active claims
  const policyholderId = policy.policyholderId;
  const activeClaims = [...claims.values()].filter(c => policies.get(c.policyId).policyholderId === policyholderId);
  if (activeClaims.length >= 3) throw new Error("A policyholder cannot have more than 3 active claims.");

  claims.set(id, new Claim(id, policyId, claimAmount));
}


export function getClaim(id) {
    return claims.get(id) || null;
}

export function updateClaim(id, claimAmount) {
    if (!claims.has(id)) throw new Error("Claim not found.");
    const claim = claims.get(id);
    const policy = policies.get(claim.policyId);
    if (claimAmount > policy.policyAmount) throw new Error("Claim exceeds policy amount.");
    claim.claimAmount = claimAmount;
}

export function deleteClaim(id) {
    if (!claims.has(id)) throw new Error("Claim not found.");
    claims.delete(id);
}
