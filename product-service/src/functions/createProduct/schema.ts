export default {
      type: "object",
      properties: {
        id: {
            type: "string",
        },
        title: {
            type: "string",
        },
        description: {
            type: "string",
        },
        price: { type: 'integer', minimum: 0 }
      },
      required: ["title", "price"],
} as const;