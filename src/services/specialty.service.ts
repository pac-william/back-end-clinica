import { CreateSpecialtyDTO } from "../dtos/specialty.dto";

interface Specialty {
  id: number;
  name: string;
}

export default class SpecialtyService {
  private specialties: Specialty[] = [];
  private currentId = 1;

  create(data: CreateSpecialtyDTO): Specialty {
    const specialty = {
      id: this.currentId++,
      name: data.name.trim(),
    };

    this.specialties.push(specialty);
    return specialty;
  }

  update(id: number, data: CreateSpecialtyDTO): Specialty | null {
    const index = this.specialties.findIndex((s) => s.id === id);
    if (index === -1) return null;

    this.specialties[index].name = data.name.trim();
    return this.specialties[index];
  }

  findAll(): Specialty[] {
    return this.specialties;
  }

  findById(id: number): Specialty | null {
    return this.specialties.find((s) => s.id === id) || null;
  }
}
