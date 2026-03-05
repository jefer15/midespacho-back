import { Case } from "../entities/case.entity";

export class CasesPageDto {

  data: Case[];

  total: number;

  page: number;

  pageSize: number;

  totalPages: number;

}