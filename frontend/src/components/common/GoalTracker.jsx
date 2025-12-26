import { useSales } from "../../context/SalesContext";
import { useNotifications } from "../../context/NotificationContext";
import { useState, useEffect, useRef } from "react";

const GoalTracker = () => {
  const { monthlyTarget, updateMonthlyTarget, deals } = useSales();
  const { addNotification } = useNotifications();
  const [isEditing, setIsEditing] = useState(false);
  const [tempTarget, setTempTarget] = useState(monthlyTarget);
  const previousPercentage = useRef(0);
  const milestoneNotified = useRef(new Set());

  const now = new Date();
  const thisMonthDeals = deals.filter(deal => {
    try {
      let dealDate;
      if (typeof deal.date === 'string') {
        dealDate = new Date(deal.date);
        if (isNaN(dealDate.getTime())) {
          const parts = deal.date.split('/');
          if (parts.length === 3) {
            dealDate = new Date(parts[2], parts[0] - 1, parts[1]);
          }
        }
      } else {
        dealDate = new Date(deal.date);
      }
      return dealDate.getMonth() === now.getMonth() && 
             dealDate.getFullYear() === now.getFullYear() &&
             deal.status === "Approved";
    } catch {
      return false;
    }
  });

  const achieved = thisMonthDeals.reduce((sum, d) => sum + (d.incentive || 0), 0);
  const percentage = Math.min((achieved / monthlyTarget) * 100, 100);

  // Check for milestone achievements
  useEffect(() => {
    const milestones = [50, 75, 90, 100];
    const currentMilestone = milestones.find(m => percentage >= m && !milestoneNotified.current.has(m));
    
    if (currentMilestone) {
      milestoneNotified.current.add(currentMilestone);
      if (currentMilestone === 100) {
        addNotification({
          type: "success",
          title: "🎉 Target Achieved!",
          message: `Congratulations! You've reached your monthly target of ₹${monthlyTarget.toLocaleString('en-IN')}.`
        });
      } else {
        addNotification({
          type: "info",
          title: `Milestone: ${currentMilestone}% Complete`,
          message: `You've achieved ${currentMilestone}% of your monthly target. Keep going!`
        });
      }
    }

    // Reset milestones if percentage drops (e.g., new month)
    if (percentage < previousPercentage.current) {
      milestoneNotified.current.clear();
    }
    
    previousPercentage.current = percentage;
  }, [percentage, monthlyTarget, addNotification]);

  const handleSave = () => {
    updateMonthlyTarget(tempTarget);
    setIsEditing(false);
  };

  return (
    <div className="card-modern p-6 bg-gradient-to-br from-white to-blue-50/30">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold bg-gradient-to-r from-primary-700 to-accent-600 bg-clip-text text-transparent mb-1">Monthly Target</h3>
          <div className="h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 w-16"></div>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs uppercase tracking-widest text-gray-600 hover:text-black transition-colors"
          >
            Edit
          </button>
        ) : (
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={tempTarget}
              onChange={(e) => setTempTarget(Number(e.target.value))}
              className="w-32 px-2 py-1 border border-gray-300 text-sm focus:border-black focus:outline-none"
            />
            <button
              onClick={handleSave}
              className="text-xs uppercase tracking-widest bg-gradient-to-r from-primary-600 to-primary-700 text-white px-3 py-1 hover:from-primary-700 hover:to-primary-800 shadow-md"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setTempTarget(monthlyTarget);
              }}
              className="text-xs uppercase tracking-widest text-gray-600 hover:text-black"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Target</p>
            <p className="text-2xl font-light text-gray-900">₹{monthlyTarget.toLocaleString('en-IN')}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Achieved</p>
            <p className="text-2xl font-light text-gray-900">₹{achieved.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className="relative h-4 bg-gray-200 border border-gray-300 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 transition-all duration-500 shadow-lg"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">{percentage.toFixed(1)}% Complete</span>
          <span className="text-gray-600">
            ₹{(monthlyTarget - achieved).toLocaleString('en-IN', { maximumFractionDigits: 2 })} remaining
          </span>
        </div>
      </div>
    </div>
  );
};

export default GoalTracker;

