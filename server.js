
const Fastify = require("fastify");
const dotenv = require("dotenv");
const swagger = require("@fastify/swagger");
const swaggerUI = require("@fastify/swagger-ui");
const { createPolicyholder, createPolicy, createClaim } = require("./crud.js");

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

/** API Routes */
fastify.get("/", async (request, reply) => {
  return { message: "Server is running" };
});

fastify.post(
  "/policyholders",
  {
    schema: {
      summary: "Create a Policyholder",
      description: "Registers a new policyholder in the system.",
      tags: ["Policyholders"],
      body: {
        type: "object",
        required: ["id", "name", "contactInfo"],
        properties: {
          id: { type: "string", description: "Unique Policyholder ID" },
          name: { type: "string", description: "Full Name" },
          contactInfo: { type: "string", description: "Contact Details" },
        },
      },
      response: {
        201: {
          description: "Policyholder Created",
          type: "object",
          properties: { message: { type: "string" } },
        },
        400: {
          description: "Invalid Data",
          type: "object",
          properties: { error: { type: "string" } },
        },
      },
    },
  },
  async (request, reply) => {
    try {
      await createPolicyholder(request.body.id, request.body.name, request.body.contactInfo);
      reply.code(201).send({ message: "Policyholder created successfully" });
    } catch (err) {
      reply.code(400).send({ error: err.message });
    }
  }
);

fastify.post(
  "/policies",
  {
    schema: {
      summary: "Create a Policy",
      description: "Assigns a new policy to an existing policyholder.",
      tags: ["Policies"],
      body: {
        type: "object",
        required: ["id", "policyholderId", "policyAmount"],
        properties: {
          id: { type: "string", description: "Unique Policy ID" },
          policyholderId: { type: "string", description: "Associated Policyholder ID" },
          policyAmount: { type: "number", description: "Total Policy Amount" },
        },
      },
      response: {
        201: {
          description: "Policy Created",
          type: "object",
          properties: { message: { type: "string" } },
        },
        400: {
          description: "Invalid Data",
          type: "object",
          properties: { error: { type: "string" } },
        },
      },
    },
  },
  async (request, reply) => {
    try {
      await createPolicy(request.body.id, request.body.policyholderId, request.body.policyAmount);
      reply.code(201).send({ message: "Policy created successfully" });
    } catch (err) {
      reply.code(400).send({ error: err.message });
    }
  }
);

fastify.post(
  "/claims",
  {
    schema: {
      summary: "File a Claim",
      description: "Creates a claim for an existing policy.",
      tags: ["Claims"],
      body: {
        type: "object",
        required: ["id", "policyId", "claimAmount"],
        properties: {
          id: { type: "string", description: "Unique Claim ID" },
          policyId: { type: "string", description: "Associated Policy ID" },
          claimAmount: { type: "number", description: "Claimed Amount" },
        },
      },
      response: {
        201: {
          description: "Claim Created",
          type: "object",
          properties: { message: { type: "string" } },
        },
        400: {
          description: "Invalid Data",
          type: "object",
          properties: { error: { type: "string" } },
        },
      },
    },
  },
  async (request, reply) => {
    try {
      await createClaim(request.body.id, request.body.policyId, request.body.claimAmount);
      reply.code(201).send({ message: "Claim created successfully" });
    } catch (err) {
      reply.code(400).send({ error: err.message });
    }
  }
);

/** Start Server */
fastify.listen({ port: Number(port), host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server running at ${address}`);
});
