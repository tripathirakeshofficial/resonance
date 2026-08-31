import { PutObjectCommand, PutObjectCommandInput, S3Client } from "@aws-sdk/client-s3";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { CANONICAL_SYSTEM_VOICE_NAMES } from "../src/features/voices/data/voice-scoping";
import { PrismaClient, type VoiceCategory } from "../src/generated/prisma/client";

const SYSTEM_VOICES_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "system-voices");

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  R2_ACCOUNT_ID: z.string().min(1),
  R2_ACCESS_KEY_ID: z.string().min(1),
  R2_SECRET_ACCESS_KEY: z.string().min(1),
  R2_BUCKET_NAME: z.string().min(1),
});

const env = envSchema.parse(process.env);

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

interface VoiceMetadata {
  description: string;
  category: VoiceCategory;
  language: string;
}

const systemVoiceMetadata: Record<string, VoiceMetadata> = {
  Aaron: {
    description: "Soothing and calm, like a self-help audiobook narrator",
    category: "AUDIOBOOK",
    language: "en-us",
  },

  Abigail: {
    description: "Warm, friendly, and engaging for natural conversations",
    category: "CONVERSATIONAL",
    language: "en-us",
  },

  Anaya: {
    description: "Clear and reassuring, ideal for customer support interactions",
    category: "CUSTOMER_SERVICE",
    language: "en-in",
  },

  Andy: {
    description: "Balanced and versatile for everyday spoken content",
    category: "GENERAL",
    language: "en-us",
  },

  Archer: {
    description: "Confident and expressive, suited for storytelling and narration",
    category: "NARRATIVE",
    language: "en-gb",
  },

  Brian: {
    description: "Distinctive and expressive, perfect for character-driven dialogue",
    category: "CHARACTERS",
    language: "en-us",
  },

  Chloe: {
    description: "Gentle and relaxing, designed for mindfulness and meditation",
    category: "MEDITATION",
    language: "en-gb",
  },

  Dylan: {
    description: "Energetic and inspiring, with a confident motivational tone",
    category: "MOTIVATIONAL",
    language: "en-us",
  },

  Emmanuel: {
    description: "Polished and conversational, well suited to podcast discussions",
    category: "PODCAST",
    language: "en-us",
  },

  Ethan: {
    description: "Dynamic and persuasive, designed for promotional and advertising content",
    category: "ADVERTISING",
    language: "en-us",
  },

  Evelyn: {
    description: "Professional and polished for narration and voiceover work",
    category: "VOICEOVER",
    language: "en-us",
  },

  Gavin: {
    description: "Authoritative and professional, ideal for corporate communications",
    category: "CORPORATE",
    language: "en-gb",
  },

  Gordon: {
    description: "Rich and composed, with the presence of a traditional narrator",
    category: "AUDIOBOOK",
    language: "en-gb",
  },

  Ivan: {
    description: "Natural and approachable for friendly everyday interactions",
    category: "CONVERSATIONAL",
    language: "en-us",
  },

  Laura: {
    description: "Helpful and professional, with a clear customer-friendly delivery",
    category: "CUSTOMER_SERVICE",
    language: "es-es",
  },

  Lucy: {
    description: "Bright and natural, suitable for a wide range of spoken content",
    category: "GENERAL",
    language: "en-au",
  },

  Madison: {
    description: "Expressive and dramatic, bringing stories and scenes to life",
    category: "NARRATIVE",
    language: "en-us",
  },

  Marisol: {
    description: "Warm and soothing, creating a peaceful atmosphere for relaxation",
    category: "MEDITATION",
    language: "es-mx",
  },

  Meera: {
    description: "Positive and uplifting, designed to energize and inspire listeners",
    category: "MOTIVATIONAL",
    language: "en-in",
  },

  Walter: {
    description:
      "Deep and authoritative, ideal for professional presentations and corporate content",
    category: "CORPORATE",
    language: "en-us",
  },
};

async function readSystemVoiceAudio(name: string) {
  const filePath = path.join(SYSTEM_VOICES_DIR, `${name}.wav`);
  const buffer = Buffer.from(await fs.readFile(filePath));
  return { buffer, contentType: "audio/wav" };
}

async function uploadSystemVoiceAudio({
  buffer,
  key,
  contentType,
}: {
  buffer: Buffer;
  key: string;
  contentType: string;
}) {
  const commandInput: PutObjectCommandInput = {
    Bucket: env.R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  };

  await r2.send(new PutObjectCommand(commandInput));
}

async function seedSystemVoice(name: string) {
  const { buffer, contentType } = await readSystemVoiceAudio(name);

  const existingSystemVoice = await prisma.voice.findFirst({
    where: {
      variant: "SYSTEM",
      name,
    },
    select: { id: true },
  });

  if (existingSystemVoice) {
    const r2ObjectKey = `voices/system/${existingSystemVoice.id}`;
    const meta = systemVoiceMetadata[name];

    await uploadSystemVoiceAudio({
      key: r2ObjectKey,
      buffer,
      contentType,
    });

    await prisma.voice.update({
      where: { id: existingSystemVoice.id },
      data: {
        r2ObjectKey,
        ...(meta && {
          description: meta.description,
          category: meta.category,
          language: meta.language,
        }),
      },
    });
  }

  const meta = systemVoiceMetadata[name];

  const voice = await prisma.voice.create({
    data: {
      name,
      variant: "SYSTEM",
      orgId: null,
      ...(meta && {
        description: meta.description,
        category: meta.category,
        language: meta.language,
      }),
    },
    select: {
      id: true,
    },
  });

  const r2ObjectKey = `voices/system/${voice.id}`;

  try {
    await uploadSystemVoiceAudio({
      key: r2ObjectKey,
      buffer,
      contentType,
    });

    await prisma.voice.update({
      where: {
        id: voice.id,
      },
      data: {
        r2ObjectKey,
      },
    });
  } catch (error) {
    await prisma.voice
      .delete({
        where: {
          id: voice.id,
        },
      })
      .catch(() => {});

    throw error;
  }
}

async function main() {
  console.log(`Seeding ${CANONICAL_SYSTEM_VOICE_NAMES.length} system voices...`);

  for (const name of CANONICAL_SYSTEM_VOICE_NAMES) {
    console.log(`- ${name}`);
    await seedSystemVoice(name);
  }

  console.log("System voice seed completed.");
}

main()
  .catch((error) => {
    console.error("Failed to seed system voices: ", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
