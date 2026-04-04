import SummaryCard from "../ui/SummaryCard";
import { formatCurrency } from "../../utils/formatCurrency";

export default function SummaryCards({ summary }) {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            <SummaryCard label="Total Income" value={formatCurrency(summary?.totalIncome)} accent="green" />
            <SummaryCard label="Total Expenses" value={formatCurrency(summary?.totalExpenses)} accent="red" />
            <SummaryCard
                label="Net Balance"
                value={formatCurrency(summary?.netBalance)}
                accent={(summary?.netBalance || 0) >= 0 ? "blue" : "red"}
            />
        </div>
    );
}
