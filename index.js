const Hapi = require("@hapi/hapi");
const Joi = require("joi");
const Blipp = require("blipp");
const Inert = require("@hapi/inert");
const Vision = require("@hapi/vision");
const HapiSwagger = require("hapi-swagger");

const exampleSchema = Joi.object({
  nullable_property: Joi.string().default(null).example(null),
}).required();

const ser = async () => {
  const server = Hapi.Server({
    host: "localhost",
    port: 3000,
  });

  await server.register([
    Inert,
    Vision,
    Blipp,
    {
      plugin: HapiSwagger,
      options: {
        info: {
          title: "Test API Documentation",
          description: "This is a sample example of API documentation.",
        },
      },
    },
  ]);

  server.route({
    method: "POST",
    path: "/v1/obj",
    options: {
      handler: (request, h) => {
        return h.response("success");
      },
      tags: ["api"],
      validate: {
        payload: exampleSchema,
      },
      response: {
        status: {
          201: exampleSchema,
        },
      },
    },
  });

  await server.start();
  return server;
};

ser()
  .then((server) => {
    console.log(`Server listening on ${server.info.uri}`);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
