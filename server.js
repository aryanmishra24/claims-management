
const Fastify = require("fastify");
const dotenv = require("dotenv");
const swagger = require("@fastify/swagger");
const swaggerUI = require("@fastify/swagger-ui");
const { createPolicyholder, createPolicy, createClaim } = require("./crud.js");
import cors from "@fastify/cors";
const API_SECRET_KEY = process.env.API_KEY ;

import fastifyMetrics from "fastify-metrics";
import pino from "pino";

// Initialize Fastify with logging
const fastify = Fastify({
  logger: {
    level: 'info', // Set the logging level
  }
});




// Enable Prometheus metrics
fastify.register(fastifyMetrics, { endpoint: "/metrics" });

// Sample route
fastify.get("/", async (request, reply) => {
  return { message: "Monitoring Setup Running!" };
});

// Middleware to check API Key
fastify.addHook('preHandler', async (req, reply) => {
    const apiKey = req.headers['x-api-key']; // Read API key from headers
    if (!apiKey || apiKey !== API_SECRET_KEY) {
        reply.code(403).send({ error: 'Forbidden: Invalid API Key' });
    }
});


dotenv.config(); // Load environment variables

const port = process.env.PORT || 3000;

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
