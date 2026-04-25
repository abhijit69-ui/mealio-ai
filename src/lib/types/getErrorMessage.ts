import { Prisma } from "$/generated/prisma/client";
import { fromError } from "zod-validation-error";
import { ZodError } from "zod";

const PRISMA_ERROR_CODES = new Map<string, string>([
  ["P2000", "The provided value is too long for the column"],
  ["P2001", "Record not found"],
  ["P2002", "Unique constraint failed"],
  ["P2003", "Foreign key constraint failed"],
  ["P2004", "Database constraint failed"],
  ["P2005", "Invalid value for field type"],
  ["P2006", "Invalid value provided"],
  ["P2007", "Data validation error"],
  ["P2008", "Failed to parse query"],
  ["P2009", "Failed to validate query"],
  ["P2010", "Raw query failed"],
  ["P2011", "Null constraint violation"],
  ["P2012", "Missing required value"],
  ["P2013", "Missing required argument"],
  ["P2014", "Relation constraint violation"],
  ["P2015", "Related record not found"],
  ["P2016", "Query interpretation error"],
  ["P2017", "Records not connected"],
  ["P2018", "Required connected records not found"],
  ["P2019", "Input error"],
  ["P2020", "Value out of range"],
  ["P2021", "Table does not exist"],
  ["P2022", "Column does not exist"],
  ["P2023", "Inconsistent data"],
  ["P2024", "Connection pool timeout"],
  ["P2025", "Required record not found"],
  ["P2026", "Unsupported database feature"],
  ["P2027", "Multiple database errors occurred"],
]);

// 🔥 Type guard for Prisma error
const isPrismaKnownError = (
  error: unknown,
): error is Prisma.PrismaClientKnownRequestError => {
  return error instanceof Prisma.PrismaClientKnownRequestError;
};

const getErrorMessage = (error: unknown): string => {
  // 🧠 Zod validation (handle early)
  if (error instanceof ZodError) {
    return fromError(error).toString();
  }

  // 🗄️ Prisma known errors
  if (isPrismaKnownError(error)) {
    const errorCode = error.code;

    // Special handling for unique constraint
    if (errorCode === "P2002") {
      const field = (error.meta?.target as string[])?.[0] || "field";
      return `A record with this ${field} already exists.`;
    }

    const message = PRISMA_ERROR_CODES.get(errorCode);
    if (message) return message;
  }

  // 🧪 Prisma validation error
  if (error instanceof Prisma.PrismaClientValidationError) {
    return "Invalid data provided.";
  }

  // 🔐 Better Auth / generic errors
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();

    if (msg.includes("invalid")) {
      return "Invalid credentials.";
    }

    if (msg.includes("email")) {
      return "Email already exists or is invalid.";
    }

    return error.message;
  }

  return "An unexpected error occurred.";
};

export { getErrorMessage };
