import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Utility function to handle errors and prevent server shutdown
const handleError = (error) => {
  console.error(error.message);
  throw new Error(error.message);  // Instead of returning, throw an error
};

// ✅ Create a new policyholder with validation
export async function createPolicyholder(id, name, contactInfo) {
  const existing = await prisma.policyholder.findUnique({
    where: { id: "some-id" }
  });
  if (existing) {
    throw new Error("Policyholder with this ID already exists.");
  }
  try {
    if (!name || !contactInfo) {
      throw new Error("Name and contact info must not be empty.");
    }

    if (!/^\S+@\S+\.\S+$/.test(contactInfo) && !/^\d{10,15}$/.test(contactInfo)) {
      throw new Error("Contact info should be a valid email or phone number.");
    }

    return await prisma.policyholder.create({
      data: { id, name, contactInfo },
    });
  } catch (error) {
    handleError(error);  // Throws the error instead of returning it
  }
}

// ✅ Update a policyholder's name or contact info
export async function updatePolicyholder(id, name, contactInfo) {
  try {
    const policyholder = await prisma.policyholder.findUnique({ where: { id } });
    if (!policyholder) throw new Error("Policyholder not found.");

    if (contactInfo && !/^\S+@\S+\.\S+$/.test(contactInfo) && !/^\d{10,15}$/.test(contactInfo)) {
      throw new Error("Contact info should be a valid email or phone number.");
    }

    return await prisma.policyholder.update({
      where: { id },
      data: { name: name || policyholder.name, contactInfo: contactInfo || policyholder.contactInfo },
    });
  } catch (error) {
    handleError(error);  // Throws the error instead of returning it
  }
}

// ✅ Retrieve a policyholder
export async function getPolicyholder(id) {
  return await prisma.policyholder.findUnique({ where: { id } });
}

// ✅ Create a new policy with validation
export async function createPolicy(id, policyholderId, policyAmount) {
  const existing = await prisma.policy.findUnique({
    where: { id: "some-id" }
  });
  if (existing) {
    throw new Error("Policy with this ID already exists.");
  }
  try {
    if (policyAmount <= 0) {
      throw new Error("The policy amount must be greater than 0.");
    }

    const policyholder = await prisma.policyholder.findUnique({
      where: { id: policyholderId },
      include: { policies: true },
    });

    if (!policyholder) {
      throw new Error("Invalid Policyholder ID.");
    }

    if (policyholder.policies.length >= 5) {
      throw new Error("A policyholder cannot have more than 5 policies.");
    }

    return await prisma.policy.create({
      data: { id, policyholderId, policyAmount },
    });
  } catch (error) {
    handleError(error);  // Throws the error instead of returning it
  }
}

// ✅ Update a policy (only amount)
export async function updatePolicy(id, policyAmount) {
  try {
    if (policyAmount <= 0) {
      throw new Error("The policy amount must be greater than 0.");
    }

    const policy = await prisma.policy.findUnique({ where: { id } });
    if (!policy) throw new Error("Policy not found.");

    return await prisma.policy.update({
      where: { id },
      data: { policyAmount },
    });
  } catch (error) {
    handleError(error);  // Throws the error instead of returning it
  }
}

// ✅ Retrieve policies for a policyholder
export async function getPoliciesByPolicyholder(policyholderId) {
  return await prisma.policy.findMany({ where: { policyholderId } });
}

// ✅ Create a claim with validation
export async function createClaim(id, policyId, claimAmount) {
  const existing = await prisma.claim.findUnique({
    where: { id: "some-id" }
  });
  if (existing) {
    throw new Error("Claim with this ID already exists.");
  }
  try {
    if (claimAmount <= 0) {
      throw new Error("The claim amount must be greater than 0.");
    }

    const policy = await prisma.policy.findUnique({
      where: { id: policyId },
      include: { claims: true, policyholder: true },
    });

    if (!policy) {
      throw new Error("Invalid Policy ID.");
    }

    if (claimAmount > policy.policyAmount) {
      throw new Error("Claim amount exceeds policy coverage.");
    }

    const policyholderId = policy.policyholder.id;
    const activeClaims = await prisma.claim.count({
      where: { policy: { policyholderId } },
    });

    if (activeClaims >= 3) {
      throw new Error("A policyholder cannot have more than 3 active claims at a time.");
    }

    return await prisma.claim.create({
      data: { id, policyId, amount: claimAmount },
    });
  } catch (error) {
    handleError(error);  // Throws the error instead of returning it
  }
}

// ✅ Update a claim (only claim amount)
export async function updateClaim(id, claimAmount) {
  try {
    if (claimAmount <= 0) {
      throw new Error("The claim amount must be greater than 0.");
    }

    const claim = await prisma.claim.findUnique({
      where: { id },
      include: { policy: true },
    });

    if (!claim) throw new Error("Claim not found.");
    if (claimAmount > claim.policy.policyAmount) {
      throw new Error("Claim amount exceeds policy coverage.");
    }

    return await prisma.claim.update({
      where: { id },
      data: { amount: claimAmount },
    });
  } catch (error) {
    handleError(error);  // Throws the error instead of returning it
  }
}

// ✅ Retrieve claims for a policy
export async function getClaimsByPolicy(policyId) {
  return await prisma.claim.findMany({ where: { policyId } });
}

// ✅ Delete operations
export async function deletePolicyholder(id) {
  return await prisma.policyholder.delete({ where: { id } });
}

export async function deletePolicy(id) {
  return await prisma.policy.delete({ where: { id } });
}

export async function deleteClaim(id) {
  return await prisma.claim.delete({ where: { id } });
}

// ✅ Gracefully close Prisma connection
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
