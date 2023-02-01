import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

const petSchema = z.object({
  id: z
    .string()
    .uuid()
    .default(() => uuidv4()),
  name: z.string().min(1).max(255),
  ownerId: z.string().uuid(),
  species: z.string().min(1).max(255),
});

export default petSchema;
