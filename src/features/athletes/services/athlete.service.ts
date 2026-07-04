import {
  athleteRepository,
  type AthleteUpdateInput,
} from "@/features/athletes/repositories/athlete.repository";
import type { AthleteDocument } from "@/features/athletes/repositories/models/athlete.model";
import type { AthleteInput } from "@/features/athletes/schemas/athlete.schema";
import type { AthleteDTO } from "@/features/athletes/types/athlete.types";
import {
  AthleteEmailInUseError,
  AthleteNotFoundError,
} from "@/features/athletes/services/athlete.errors";

function toDTO(doc: AthleteDocument): AthleteDTO {
  return {
    id: doc._id.toString(),
    firstName: doc.firstName,
    lastName: doc.lastName,
    email: doc.email,
    phone: doc.phone ?? null,
    gender: doc.gender,
    birthDate: doc.birthDate.toISOString(),
    height: doc.height,
    initialWeight: doc.initialWeight,
    goal: doc.goal,
    status: doc.status,
    createdAt: doc.createdAt.toISOString(),
  };
}

function toPersistence(input: AthleteInput): AthleteUpdateInput {
  const phone = input.phone?.trim();
  return {
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email.toLowerCase(),
    gender: input.gender,
    birthDate: new Date(input.birthDate),
    height: Number(input.height),
    initialWeight: Number(input.initialWeight),
    goal: input.goal,
    ...(phone && phone.length > 0 ? { phone } : {}),
  };
}

export async function listAthletes(coachId: string): Promise<AthleteDTO[]> {
  const docs = await athleteRepository.listByCoach(coachId);
  return docs.map(toDTO);
}

export async function getAthlete(
  coachId: string,
  id: string,
): Promise<AthleteDTO | null> {
  const doc = await athleteRepository.findByIdForCoach(coachId, id);
  return doc ? toDTO(doc) : null;
}

export async function createAthlete(
  coachId: string,
  input: AthleteInput,
): Promise<AthleteDTO> {
  const data = toPersistence(input);

  if (await athleteRepository.existsByEmail(data.email)) {
    throw new AthleteEmailInUseError();
  }

  const doc = await athleteRepository.create({ ...data, coachId });
  return toDTO(doc);
}

export async function updateAthlete(
  coachId: string,
  id: string,
  input: AthleteInput,
): Promise<AthleteDTO> {
  // Ownership check: only the owning coach can load (and therefore update).
  const current = await athleteRepository.findByIdForCoach(coachId, id);
  if (!current) {
    throw new AthleteNotFoundError();
  }

  const data = toPersistence(input);

  if (
    data.email !== current.email &&
    (await athleteRepository.existsByEmail(data.email))
  ) {
    throw new AthleteEmailInUseError();
  }

  const updated = await athleteRepository.updateForCoach(coachId, id, data);
  if (!updated) {
    throw new AthleteNotFoundError();
  }

  return toDTO(updated);
}

export async function deactivateAthlete(
  coachId: string,
  id: string,
): Promise<AthleteDTO> {
  const updated = await athleteRepository.setStatusForCoach(
    coachId,
    id,
    "inactive",
  );
  if (!updated) {
    throw new AthleteNotFoundError();
  }
  return toDTO(updated);
}
