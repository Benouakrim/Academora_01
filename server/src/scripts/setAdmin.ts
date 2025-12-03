import 'dotenv/config'
import { PrismaClient, UserRole } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const emailArg = process.argv[2]
  if (!emailArg) {
    console.error('Usage: tsx src/scripts/setAdmin.ts <email>')
    console.error('Example: tsx src/scripts/setAdmin.ts user@example.com')
    process.exit(1)
  }

  const user = await prisma.user.findUnique({ where: { email: emailArg } })
  
  if (!user) {
    console.log(`❌ User not found for email: ${emailArg}`)
    console.log('\nPlease sign in to the application first to create your user profile.')
    process.exit(1)
  }

  if (user.role === UserRole.ADMIN) {
    console.log(`✅ User ${user.email} is already an admin`)
    console.log(JSON.stringify({ 
      id: user.id,
      email: user.email, 
      name: `${user.firstName} ${user.lastName}`,
      role: user.role 
    }, null, 2))
  } else {
    const updated = await prisma.user.update({
      where: { email: emailArg },
      data: { role: UserRole.ADMIN }
    })
    
    console.log(`✅ Successfully updated user to ADMIN role`)
    console.log(JSON.stringify({ 
      id: updated.id,
      email: updated.email, 
      name: `${updated.firstName} ${updated.lastName}`,
      role: updated.role 
    }, null, 2))
    console.log('\n🔄 Please refresh your browser to apply the changes.')
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e.message)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
