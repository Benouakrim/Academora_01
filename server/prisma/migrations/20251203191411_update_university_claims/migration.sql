-- AlterTable
ALTER TABLE "University" ADD COLUMN     "claimedAt" TIMESTAMP(3),
ADD COLUMN     "claimedById" TEXT;

-- AlterTable
ALTER TABLE "UniversityClaim" ADD COLUMN     "adminNotes" TEXT,
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "requesterEmail" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "requesterName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ADD COLUMN     "reviewedById" TEXT,
ADD COLUMN     "universityGroupId" TEXT,
ALTER COLUMN "universityId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UniversityGroup" ADD COLUMN     "claimedAt" TIMESTAMP(3),
ADD COLUMN     "claimedById" TEXT;

-- CreateIndex
CREATE INDEX "UniversityClaim_universityGroupId_idx" ON "UniversityClaim"("universityGroupId");

-- AddForeignKey
ALTER TABLE "University" ADD CONSTRAINT "University_claimedById_fkey" FOREIGN KEY ("claimedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniversityClaim" ADD CONSTRAINT "UniversityClaim_universityGroupId_fkey" FOREIGN KEY ("universityGroupId") REFERENCES "UniversityGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniversityClaim" ADD CONSTRAINT "UniversityClaim_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniversityGroup" ADD CONSTRAINT "UniversityGroup_claimedById_fkey" FOREIGN KEY ("claimedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
