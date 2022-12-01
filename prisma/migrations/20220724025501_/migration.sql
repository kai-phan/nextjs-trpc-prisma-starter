/*
  Warnings:

  - You are about to drop the `Portfolio` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Portfolio" DROP CONSTRAINT "Portfolio_userId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_userId_fkey";

-- DropTable
DROP TABLE "Portfolio";

-- DropTable
DROP TABLE "Transaction";

-- DropEnum
DROP TYPE "IncomeType";

-- DropEnum
DROP TYPE "PortfolioCategory";

-- DropEnum
DROP TYPE "PortfolioConnectionType";

-- DropEnum
DROP TYPE "PortfolioLabel";

-- DropEnum
DROP TYPE "PortfolioSubType";

-- DropEnum
DROP TYPE "PortfolioType";

-- DropEnum
DROP TYPE "TransactionLabel";
