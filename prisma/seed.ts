import { auth } from "@/lib/auth";
import db from "@/lib/db";

async function main() {
  const adminEmail = "super@admin.com";

  const existingAdmin = await db.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    await auth.api.signUpEmail({
      body: {
        name: "Super Admin",
        email: adminEmail,
        password: "SuperAdmin@123",
      },
    });

    await db.user.update({
      where: { email: adminEmail },
      data: { role: "admin" },
    });

    console.log("Created super admin: " + adminEmail);
  } else {
    console.log("Super admin already exists: " + existingAdmin.email);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
