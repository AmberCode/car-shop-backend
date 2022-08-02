export default {
      type: "object",
      properties: {
        title: { type: 'string', minLength: 1 },
        description: { type: 'string' },
        price: { type: 'integer', minimum: 0 },
        count: { type: 'integer', minimum: 0 }
      },
      required: ["title", "price", "count"],
} as const;