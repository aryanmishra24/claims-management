import Fastify from "fastify";
import dotenv from "dotenv";
import { createPolicyholder, createPolicy, createClaim } from "./crud.js";

dotenv.config(); // Load environment variables

const port = process.env.PORT || 3000;
const fastify = Fastify({ logger: true });

// Middleware to check API Key
fastify.addHook("onRequest", async (request, reply) => {
  const apiKey = request.headers["x-api-key"];

  if (!apiKey || apiKey !== process.env.API_KEY) {
    reply.code(401).send({ error: "Unauthorized - Invalid API Key" });
  }
});

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
fastify.listen({ port: Number(port), host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server running at ${address}`);
});
