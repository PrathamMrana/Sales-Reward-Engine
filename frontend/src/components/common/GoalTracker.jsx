import { useSales } from "../../context/SalesContext";
import { useNotifications } from "../../context/NotificationContext";
import { useState, useEffect, useRef } from "react";

const GoalTracker = () => {
  const { monthlyTarget, updateMonthlyTarget, deals } = useSales();
  const { addNotification, notifications } = useNotifications();
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

  // Forecasting Logic
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const currentDay = now.getDate();
  // Avoid division by zero, assume at least 1 day passed effectively for projection
  const effectiveDaysString = Math.max(currentDay, 1);
  const dailyAverage = achieved / effectiveDaysString;
  const projected = dailyAverage * daysInMonth;

  // Status Logic
  let status = "On Track";
  const requiredDaily = monthlyTarget / daysInMonth;

  if (percentage >= 100) {
    status = "Completed";
  } else if (dailyAverage < requiredDaily * 0.8) {
    status = "Behind";
  } else if (dailyAverage < requiredDaily) {
    status = "At Risk";
  }

  // Check for milestone achievements
  useEffect(() => {
    const milestones = [50, 75, 90, 100];
    const currentMilestone = milestones.find(m => percentage >= m && !milestoneNotified.current.has(m));

    if (currentMilestone) {
      milestoneNotified.current.add(currentMilestone);
      const title = currentMilestone === 100 ? "🎉 Target Achieved!" : `Milestone: ${currentMilestone}% Complete`;

      // Prevent duplicate notifications (check history too so we don't re-notify on refresh)
      const alreadyNotified = notifications.some(n => n.title === title);

      if (!alreadyNotified) {
        if (currentMilestone === 100) {
          addNotification({
            type: "success",
            title: title,
            message: `Congratulations! You've reached your monthly target of ₹${monthlyTarget.toLocaleString('en-IN')}.`
          });
        } else {
          addNotification({
            type: "info",
            title: title,
            message: `You've achieved ${currentMilestone}% of your monthly target. Keep going!`
          });
        }
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
    <div className="card-modern p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-full blur-2xl"></div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold bg-gradient-to-r from-primary-700 to-accent-600 bg-clip-text text-transparent mb-1">Monthly Target</h3>
          <div className="h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 w-16"></div>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs uppercase tracking-widest text-text-secondary hover:text-text-primary transition-colors"
          >
            Edit
          </button>
        ) : (
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={tempTarget}
              onChange={(e) => setTempTarget(Number(e.target.value))}
              className="w-32 px-2 py-1 bg-surface-2 border border-border-strong text-sm focus:border-accent-primary focus:outline-none text-text-primary"
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
              className="text-xs uppercase tracking-widest text-text-secondary hover:text-text-primary"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {/* Progress Circle & Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative w-16 h-16">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-surface-3" />
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent"
                  strokeDasharray={175.93}
                  strokeDashoffset={175.93 - (175.93 * percentage) / 100}
                  className={`${percentage >= 100 ? 'text-emerald-500' : 'text-primary-500'} transition-all duration-1000 ease-out`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-text-primary">{percentage.toFixed(0)}%</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-text-muted uppercase tracking-widest mb-0.5">Status</p>
              <div className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${status === 'On Track' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : status === 'At Risk' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${status === 'On Track' ? 'bg-emerald-500' : status === 'At Risk' ? 'bg-amber-500' : 'bg-red-500'}`}></span>
                <span>{status}</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs text-text-muted uppercase tracking-widest mb-1">Projected</p>
            <p className="text-xl font-semibold text-text-primary">₹{projected.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
            <p className="text-[10px] text-text-secondary mt-0.5">
              {projected >= monthlyTarget ? "Target likely to be met" : `Short by ₹${(monthlyTarget - projected).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border-subtle">
          <div>
            <p className="text-[10px] text-text-muted uppercase tracking-widest mb-1">Target</p>
            <p className="text-lg font-medium text-text-primary">₹{monthlyTarget.toLocaleString('en-IN')}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-text-muted uppercase tracking-widest mb-1">Achieved</p>
            <p className="text-lg font-medium text-primary-600 dark:text-primary-400">₹{achieved.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalTracker;

