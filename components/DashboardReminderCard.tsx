interface DashboardReminderItem {
  title: string;
  time: string;
  detail: string;
}

interface DashboardReminderCardProps {
  reminders: DashboardReminderItem[];
}

const DashboardReminderCard = ({ reminders }: DashboardReminderCardProps) => {
  return (
    <div className="card-border w-full">
      <div className="card flex flex-col gap-5 p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-light-100/60">
            Reminders
          </p>
          <h3 className="mt-1 text-primary-100">
            Upcoming interview reminders
          </h3>
        </div>

        <div className="flex flex-col gap-3">
          {reminders.map((reminder) => (
            <div
              key={`${reminder.title}-${reminder.time}`}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 transition-transform duration-200 hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-primary-100">
                    {reminder.title}
                  </p>
                  <p className="mt-1 text-sm text-light-100/75">
                    {reminder.detail}
                  </p>
                </div>
                <span className="whitespace-nowrap rounded-full border border-white/10 bg-dark-200 px-3 py-1 text-xs text-light-100/80">
                  {reminder.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardReminderCard;
