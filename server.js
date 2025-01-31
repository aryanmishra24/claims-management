
const Fastify = require("fastify");
const dotenv = require("dotenv");
const swagger = require("@fastify/swagger");
const swaggerUI = require("@fastify/swagger-ui");
const { createPolicyholder, createPolicy, createClaim } = require("./crud.js");
import cors from "@fastify/cors";

dotenv.config(); // Load environment variables

const port = process.env.PORT || 3000;
const fastify = Fastify({ logger: true });

/** Swagger Configuration */
const swaggerOptions = {
  swagger: {
    info: {
      title: "Claims Management API",
      description: "API for managing policyholders, policies, and claims.",
      version: "1.0.0",
    },
    host: "localhost:3000",
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
  },
};

fastify.register(swagger, swaggerOptions);
fastify.register(swaggerUI, { routePrefix: "/docs", exposeRoute: true });


fastify.register(cors, {
  origin: "*", // Allow all origins (change to specific frontend URL if needed)
  methods: ["GET", "POST", "PUT", "DELETE"],
});

// Routes
// ✅ Create Policyholder (Correct)
fastify.post("/policyholders", async (request, reply) => {
  const { id, name, contactInfo } = request.body;
  try {
    await createPolicyholder(id, name, contactInfo);
    reply.send({ message: "Policyholder created" });
  } catch (err) {
    reply.status(400).send({ error: err.message });
  }
});

// ✅ Create Policy (Fixed)
fastify.post("/policies", async (request, reply) => {
  const { id, policyholderId, policyAmount } = request.body; // ✅ Extract correct fields
  try {
    await createPolicy(id, policyholderId, policyAmount);
    reply.send({ message: "Policy created" });
  } catch (err) {
    reply.status(400).send({ error: err.message });
  }
});

// ✅ Create Claim (Fixed)
fastify.post("/claims", async (request, reply) => {
  const { id, policyId, claimAmount } = request.body; // ✅ Extract correct fields
  try {
    await createClaim(id, policyId, claimAmount);
    reply.send({ message: "Claim created" });
  } catch (err) {
    reply.status(400).send({ error: err.message });
  }
});


/** Start Server */
fastify.listen({ port: Number(port), host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server running at ${address}`);
});
