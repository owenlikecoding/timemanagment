# AI Daily Planner - Student Time Management

A student-focused AI daily planner that maximizes limited time across school, practice, and two businesses: **Nirvo AI** (SaaS, long-term) and **Palmetto Home Care** (local service, cash-now).

Built with Next.js, TypeScript, Tailwind CSS, shadcn/ui, and Supabase.

## Features

✨ **Smart Task Scoring**
- Auto-scores tasks by deadline, revenue potential, urgency, and energy required
- Prioritizes cash-generating tasks (Palmetto Home Care) alongside long-term growth (Nirvo AI)

📅 **Intelligent Scheduling**
- Locks school (M-F 8am-3pm), practice (M-F 3:30pm-5:30pm), and sleep (10pm-6am)
- Auto-schedules tasks into available time blocks based on priority scores
- Visual weekly schedule view

🤖 **AI Plan Explanation**
- Uses local AI logic (no paid APIs) to explain task prioritization
- Provides insights into why tasks are ordered the way they are

💼 **Business Management**
- Track tasks for Nirvo AI (SaaS, long-term revenue)
- Track tasks for Palmetto Home Care (immediate cash flow)
- Expected revenue tracking for both businesses

⚡ **Energy-Aware Scheduling**
- Tag tasks by energy level (low/medium/high)
- Optimize scheduling based on your energy capacity

## Getting Started

### Prerequisites

- Node.js 18+ installed
- (Optional) Supabase account for data persistence

### Installation

1. Clone the repository:
```bash
git clone https://github.com/owenlikecoding/timemanagment.git
cd timemanagment
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Set up Supabase:
   - Copy `.env.local.example` to `.env.local`
   - Add your Supabase credentials
   - See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for database schema

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Adding Tasks

1. Fill in the task form with:
   - **Title** (required) - What needs to be done
   - **Description** (optional) - Additional details
   - **Deadline** (required) - When it's due
   - **Estimated Time** - How long it will take (in minutes)
   - **Business** - Nirvo AI, Palmetto Home Care, or personal
   - **Expected Revenue** - Dollar amount this task will generate
   - **Urgency** - 1-10 scale of how urgent you feel it is
   - **Energy Required** - Low, medium, or high energy needed

2. Click "Add Task" to save

### Viewing Your Schedule

- The **Task List** shows all tasks sorted by priority score
- The **AI Plan Explanation** explains why your top priority is what it is
- The **Weekly Schedule** shows your fixed blocks (school, practice, sleep) and scheduled tasks

### Understanding Task Scores

Tasks are automatically scored (0-100 points) based on:
- **Deadline urgency** (40 points max) - Sooner deadlines score higher
- **Revenue potential** (30 points max) - Higher revenue scores higher, with cash-now business (Palmetto) getting a boost
- **User urgency** (20 points max) - Your 1-10 urgency rating
- **Energy efficiency** (10 points max) - Lower energy tasks can be scheduled more flexibly

## Technology Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **shadcn/ui** - UI component system
- **Supabase** (optional) - Database and authentication
- **date-fns** - Date manipulation utilities

## Project Structure

```
timemanagment/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main application page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── TaskForm.tsx      # Task creation form
│   ├── TaskList.tsx      # Task list display
│   ├── ScheduleView.tsx  # Weekly schedule view
│   └── AIPlanExplanation.tsx # AI insights
├── lib/                   # Core logic
│   ├── types.ts          # TypeScript types
│   ├── taskScoring.ts    # Task scoring algorithm
│   ├── scheduler.ts      # Scheduling logic
│   ├── supabase.ts       # Supabase client
│   └── utils.ts          # Utility functions
└── public/               # Static assets
```

## Local Storage

By default, tasks are stored in browser `localStorage`. This means:
- ✅ No server required
- ✅ Works offline
- ✅ Fast and simple
- ⚠️ Data is local to your browser
- ⚠️ Clearing browser data will delete tasks

For persistent, cloud-based storage, set up Supabase (see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)).

## Future Enhancements

Potential improvements:
- [ ] Google Calendar integration
- [ ] Mobile app version
- [ ] Team collaboration features
- [ ] Advanced AI using local LLMs (Ollama, etc.)
- [ ] Habit tracking
- [ ] Time tracking integration
- [ ] Export/import functionality

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this for your own projects!

## Support

For issues or questions, please open an issue on GitHub.
