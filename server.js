import Fastify from "fastify";
import { createPolicyholder, getPolicyholder, createPolicy, createClaim } from "./crud.js";

const fastify = Fastify({ logger: true });

// Routes
fastify.post("/policyholders", async (request, reply) => {
  const { id, name, contactInfo } = request.body;
  try {
    createPolicyholder(id, name, contactInfo);
    reply.send({ message: "Policyholder created" });
  } catch (err) {
    reply.status(400).send({ error: err.message });
  }
});

fastify.post("/policies", async (request, reply) => {
  const { id, policyholderId, policyAmount } = request.body;
  try {
    createPolicy(id, policyholderId, policyAmount);
    reply.send({ message: "Policy created" });
  } catch (err) {
    reply.status(400).send({ error: err.message });
  }
});

fastify.post("/claims", async (request, reply) => {
  const { id, policyId, claimAmount } = request.body;
  try {
    createClaim(id, policyId, claimAmount);
    reply.send({ message: "Claim created" });
  } catch (err) {
    reply.status(400).send({ error: err.message });
  }
});

// Start Server
fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server running at ${address}`);
});
