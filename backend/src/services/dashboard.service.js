const { prisma } = require("../config/prisma.js");

async function getSummary() {
    const incomeResult = await prisma.financialRecord.aggregate({
        where: { isDeleted: false, type: "INCOME" },
        _sum: { amount: true },
    });

    const expenseResult = await prisma.financialRecord.aggregate({
        where: { isDeleted: false, type: "EXPENSE" },
        _sum: { amount: true },
    });

    const totalIncome = Number(incomeResult._sum.amount || 0);
    const totalExpenses = Number(expenseResult._sum.amount || 0);
    const netBalance = totalIncome - totalExpenses;

    return {
        totalIncome,
        totalExpenses,
        netBalance,
    };
}

async function getCategoryBreakdown() {
    const incomeByCategory = await prisma.financialRecord.groupBy({
        by: ["category"],
        where: { isDeleted: false, type: "INCOME" },
        _sum: { amount: true },
    });

    const expenseByCategory = await prisma.financialRecord.groupBy({
        by: ["category"],
        where: { isDeleted: false, type: "EXPENSE" },
        _sum: { amount: true },
    });

    const categoryMap = {};

    for (const item of incomeByCategory) {
        if (!categoryMap[item.category]) {
            categoryMap[item.category] = { category: item.category, income: 0, expenses: 0 };
        }
        categoryMap[item.category].income = Number(item._sum.amount || 0);
    }

    for (const item of expenseByCategory) {
        if (!categoryMap[item.category]) {
            categoryMap[item.category] = { category: item.category, income: 0, expenses: 0 };
        }
        categoryMap[item.category].expenses = Number(item._sum.amount || 0);
    }

    return Object.values(categoryMap);
}

async function getMonthlyTrends() {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const records = await prisma.financialRecord.findMany({
        where: {
            isDeleted: false,
            date: { gte: sixMonthsAgo },
        },
        select: { date: true, type: true, amount: true },
    });

    const trends = {};

    for (let i = 0; i < 6; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
        const monthKey = date.toLocaleDateString("en-US", { year: "numeric", month: "short" });

        trends[monthKey] = {
            month: monthKey,
            income: 0,
            expenses: 0,
        };
    }

    for (const record of records) {
        const monthKey = record.date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
        });

        if (trends[monthKey]) {
            const amount = Number(record.amount);

            if (record.type === "INCOME") {
                trends[monthKey].income += amount;
            } else {
                trends[monthKey].expenses += amount;
            }
        }
    }

    return Object.values(trends);
}

async function getRecentActivity(limit = 10) {
    return prisma.financialRecord.findMany({
        where: { isDeleted: false },
        include: {
            user: {
                select: {
                    name: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
    });
}

module.exports = {
    getSummary,
    getCategoryBreakdown,
    getMonthlyTrends,
    getRecentActivity,
};
